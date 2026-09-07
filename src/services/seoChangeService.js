const { pool } = require('../config/database')

/**
 * SEO Change & Approval Service
 * Manages the approval workflow, applies approved metadata directly to MySQL tables,
 * and maintains a complete audit trail with 1-click rollback.
 */
class SeoChangeService {
  /**
   * Approve an AI Recommendation
   */
  async approveRecommendation(id, adminUser = 'Admin') {
    const [rows] = await pool.query('SELECT * FROM seo_recommendations WHERE id = ?', [id])
    if (rows.length === 0) throw new Error('Recommendation not found')

    await pool.query(
      `UPDATE seo_recommendations SET status = 'APPROVED', reviewed_at = NOW() WHERE id = ?`,
      [id]
    )

    await pool.query(
      `INSERT INTO seo_logs (event_type, status, message, details) VALUES (?, ?, ?, ?)`,
      ['recommendation_approved', 'success', `Recommendation #${id} approved by ${adminUser}`, JSON.stringify({ id, adminUser })]
    )

    return { success: true, message: `Recommendation #${id} approved.` }
  }

  /**
   * Reject an AI Recommendation
   */
  async rejectRecommendation(id, reason = 'Rejected by admin', adminUser = 'Admin') {
    const [rows] = await pool.query('SELECT * FROM seo_recommendations WHERE id = ?', [id])
    if (rows.length === 0) throw new Error('Recommendation not found')

    await pool.query(
      `UPDATE seo_recommendations SET status = 'REJECTED', reviewed_at = NOW(), reason = CONCAT(reason, ' [Rejection note: ', ?, ']') WHERE id = ?`,
      [reason, id]
    )

    await pool.query(
      `INSERT INTO seo_logs (event_type, status, message, details) VALUES (?, ?, ?, ?)`,
      ['recommendation_rejected', 'info', `Recommendation #${id} rejected by ${adminUser}`, JSON.stringify({ id, reason, adminUser })]
    )

    return { success: true, message: `Recommendation #${id} rejected.` }
  }

  /**
   * Apply an Approved Recommendation to the Database
   */
  async applyRecommendation(id, adminUser = 'Admin') {
    const [rows] = await pool.query('SELECT * FROM seo_recommendations WHERE id = ?', [id])
    if (rows.length === 0) throw new Error('Recommendation not found')

    const rec = rows[0]
    const currentVal = typeof rec.current_value === 'string' ? JSON.parse(rec.current_value) : rec.current_value
    const proposedVal = typeof rec.proposed_value === 'string' ? JSON.parse(rec.proposed_value) : rec.proposed_value

    const entityType = rec.entity_type
    const entityId = rec.entity_id

    // Apply change directly to MySQL entity table
    try {
      if (entityType === 'product' && entityId) {
        await pool.query(
          `UPDATE products 
           SET seo_title = ?, seo_description = ?, seo_heading = ?, image_alt = ? 
           WHERE id = ?`,
          [
            proposedVal.title || currentVal.title,
            proposedVal.meta_description || currentVal.meta_description,
            proposedVal.h1 || currentVal.h1,
            proposedVal.image_alt || currentVal.image_alt,
            entityId,
          ]
        )
      } else if (entityType === 'category' && entityId) {
        await pool.query(
          `UPDATE categories 
           SET seo_title = ?, seo_description = ?, seo_heading = ?, image_alt = ? 
           WHERE id = ?`,
          [
            proposedVal.title || currentVal.title,
            proposedVal.meta_description || currentVal.meta_description,
            proposedVal.h1 || currentVal.h1,
            proposedVal.image_alt || currentVal.image_alt,
            entityId,
          ]
        )
      } else if (entityType === 'service' && entityId) {
        await pool.query(
          `UPDATE services 
           SET seo_title = ?, seo_description = ?, seo_heading = ?, image_alt = ? 
           WHERE id = ?`,
          [
            proposedVal.title || currentVal.title,
            proposedVal.meta_description || currentVal.meta_description,
            proposedVal.h1 || currentVal.h1,
            proposedVal.image_alt || currentVal.image_alt,
            entityId,
          ]
        )
      } else if (entityType === 'blog' && entityId) {
        await pool.query(
          `UPDATE blogs 
           SET seo_title = ?, meta_description = ?, image_alt = ? 
           WHERE id = ?`,
          [
            proposedVal.title || currentVal.title,
            proposedVal.meta_description || currentVal.meta_description,
            proposedVal.image_alt || currentVal.image_alt,
            entityId,
          ]
        )
      }

      // Record Audit Trail in seo_changes
      const [changeInsert] = await pool.query(
        `INSERT INTO seo_changes 
         (recommendation_id, entity_type, entity_id, page_url, change_type, old_value, new_value, ai_reason, approved_by, approved_at, applied_at, status)
         VALUES (?, ?, ?, ?, 'metadata_update', ?, ?, ?, ?, NOW(), NOW(), 'applied')`,
        [
          rec.id,
          entityType,
          entityId,
          rec.page_url,
          JSON.stringify(currentVal),
          JSON.stringify(proposedVal),
          rec.reason,
          adminUser,
        ]
      )

      // Mark recommendation as APPLIED
      await pool.query(
        `UPDATE seo_recommendations SET status = 'APPLIED', applied_at = NOW() WHERE id = ?`,
        [rec.id]
      )

      // Log activity
      await pool.query(
        `INSERT INTO seo_logs (event_type, status, message, details) VALUES (?, ?, ?, ?)`,
        ['change_applied', 'success', `SEO Change #${changeInsert.insertId} applied to ${rec.page_url}`, JSON.stringify({ recommendationId: rec.id, entityType, entityId })]
      )

      return {
        success: true,
        message: `SEO metadata change applied successfully to ${rec.page_url}.`,
        changeId: changeInsert.insertId,
      }
    } catch (err) {
      await pool.query(
        `UPDATE seo_recommendations SET status = 'FAILED' WHERE id = ?`,
        [rec.id]
      )
      throw new Error(`Failed to apply SEO change: ${err.message}`)
    }
  }

  /**
   * Apply All Approved Recommendations in Bulk
   */
  async applyBulkApproved(adminUser = 'Admin') {
    const [approvedList] = await pool.query(
      `SELECT id FROM seo_recommendations WHERE status = 'APPROVED'`
    )

    let successCount = 0
    let failedCount = 0

    for (const item of approvedList) {
      try {
        await this.applyRecommendation(item.id, adminUser)
        successCount++
      } catch (err) {
        failedCount++
      }
    }

    return {
      success: true,
      message: `Applied ${successCount} approved change(s). ${failedCount > 0 ? `${failedCount} failed.` : ''}`,
      successCount,
      failedCount,
    }
  }

  /**
   * 1-Click Rollback for an applied change
   */
  async rollbackChange(changeId, adminUser = 'Admin') {
    const [rows] = await pool.query('SELECT * FROM seo_changes WHERE id = ?', [changeId])
    if (rows.length === 0) throw new Error('Change record not found')

    const change = rows[0]
    if (change.status === 'rolled_back') {
      throw new Error('This change has already been rolled back.')
    }

    const oldVal = typeof change.old_value === 'string' ? JSON.parse(change.old_value) : change.old_value
    const entityType = change.entity_type
    const entityId = change.entity_id

    try {
      if (entityType === 'product' && entityId) {
        await pool.query(
          `UPDATE products SET seo_title = ?, seo_description = ?, seo_heading = ?, image_alt = ? WHERE id = ?`,
          [oldVal.title || null, oldVal.meta_description || null, oldVal.h1 || null, oldVal.image_alt || null, entityId]
        )
      } else if (entityType === 'category' && entityId) {
        await pool.query(
          `UPDATE categories SET seo_title = ?, seo_description = ?, seo_heading = ?, image_alt = ? WHERE id = ?`,
          [oldVal.title || null, oldVal.meta_description || null, oldVal.h1 || null, oldVal.image_alt || null, entityId]
        )
      } else if (entityType === 'service' && entityId) {
        await pool.query(
          `UPDATE services SET seo_title = ?, seo_description = ?, seo_heading = ?, image_alt = ? WHERE id = ?`,
          [oldVal.title || null, oldVal.meta_description || null, oldVal.h1 || null, oldVal.image_alt || null, entityId]
        )
      } else if (entityType === 'blog' && entityId) {
        await pool.query(
          `UPDATE blogs SET seo_title = ?, meta_description = ?, image_alt = ? WHERE id = ?`,
          [oldVal.title || null, oldVal.meta_description || null, oldVal.image_alt || null, entityId]
        )
      }

      await pool.query(
        `UPDATE seo_changes SET status = 'rolled_back' WHERE id = ?`,
        [changeId]
      )

      if (change.recommendation_id) {
        await pool.query(
          `UPDATE seo_recommendations SET status = 'REVIEWED' WHERE id = ?`,
          [change.recommendation_id]
        )
      }

      await pool.query(
        `INSERT INTO seo_logs (event_type, status, message, details) VALUES (?, ?, ?, ?)`,
        ['change_rolled_back', 'success', `Change #${changeId} rolled back by ${adminUser}`, JSON.stringify({ changeId, entityType, entityId })]
      )

      return {
        success: true,
        message: `Change #${changeId} has been successfully rolled back to previous state.`,
      }
    } catch (err) {
      throw new Error(`Failed to rollback change: ${err.message}`)
    }
  }

  /**
   * Get Change History Log
   */
  async getHistory(filters = {}) {
    const { page = 1, limit = 50, entityType, status } = filters
    const offset = (Number(page) - 1) * Number(limit)

    let whereSql = 'WHERE 1=1'
    const params = []

    if (entityType && entityType !== 'all') {
      whereSql += ' AND entity_type = ?'
      params.push(entityType)
    }

    if (status && status !== 'all') {
      whereSql += ' AND status = ?'
      params.push(status)
    }

    const [rows] = await pool.query(
      `SELECT * FROM seo_changes ${whereSql} ORDER BY applied_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    )

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM seo_changes ${whereSql}`,
      params
    )

    return {
      changes: rows.map((r) => ({
        ...r,
        old_value: typeof r.old_value === 'string' ? JSON.parse(r.old_value) : r.old_value,
        new_value: typeof r.new_value === 'string' ? JSON.parse(r.new_value) : r.new_value,
      })),
      total: countRows[0].total,
      page: Number(page),
      limit: Number(limit),
    }
  }
}

module.exports = new SeoChangeService()
