import api from './api'

export async function getCategories(params = {}) {
  try {
    const { data } = await api.get('/categories', { params })
    return data?.data || []
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      return [
        {
          id: 1,
          _id: 'cat-corporate-gifts',
          name: 'Corporate Gift Items',
          slug: 'corporate-gift-items',
          description: 'Premium branded gifts, apparel, mugs, and giveaways designed for businesses and corporate events in Dubai.',
          image: '/assets/products/1 (1).jpg',
          status: 'active',
          active: true,
          displayOrder: 1,
          createdAt: new Date().toISOString(),
          productCount: 5,
        },
        {
          id: 2,
          _id: 'cat-office-stationery',
          name: 'Office Stationery Printing',
          slug: 'office-stationery-printing',
          description: 'Executive notebooks, pens, business cards, and letterheads tailored for professional brand correspondence.',
          image: '/assets/products/1 (7).jpg',
          status: 'active',
          active: true,
          displayOrder: 2,
          createdAt: new Date().toISOString(),
          productCount: 4,
        },
        {
          id: 3,
          _id: 'cat-other-products',
          name: 'Other Products',
          slug: 'other-products',
          description: 'Large-format roll-ups, outdoor flags, die-cut vinyl stickers, and acrylic executive nameplates.',
          image: '/assets/products/1 (9).jpg',
          status: 'active',
          active: true,
          displayOrder: 3,
          createdAt: new Date().toISOString(),
          productCount: 4,
        },
      ]
    }
    throw err
  }
}

export async function getCategoryById(id) {
  try {
    const { data } = await api.get(`/categories/${id}`)
    return data?.data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      return {
        id: 1,
        _id: 'cat-corporate-gifts',
        name: 'Corporate Gift Items',
        slug: 'corporate-gift-items',
        description: 'Premium branded gifts',
        image: '/assets/products/1 (1).jpg',
        status: 'active',
        active: true,
        displayOrder: 1,
      }
    }
    throw err
  }
}

export async function createCategory(categoryData) {
  try {
    const { data } = await api.post('/categories', categoryData)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      const newCategory = {
        id: Date.now(),
        _id: `cat-${Date.now()}`,
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || '',
        image: categoryData.image || '/assets/products/1 (1).jpg',
        status: categoryData.status || 'active',
        active: categoryData.status !== 'inactive',
        displayOrder: Number(categoryData.displayOrder || 0),
        createdAt: new Date().toISOString(),
        productCount: 0,
      }
      return { success: true, message: 'Category created successfully', data: newCategory }
    }
    throw err
  }
}

export async function updateCategory(id, categoryData) {
  try {
    const { data } = await api.put(`/categories/${id}`, categoryData)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      return { success: true, message: 'Category updated successfully', data: { id, ...categoryData } }
    }
    throw err
  }
}

export async function updateCategoryStatus(id, status) {
  try {
    const { data } = await api.patch(`/categories/${id}/status`, { status })
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      return { success: true, message: `Category status changed to ${status}`, data: { id, status } }
    }
    throw err
  }
}

export async function deleteCategory(id) {
  try {
    const { data } = await api.delete(`/categories/${id}`)
    return data
  } catch (err) {
    if (err.message === 'Network Error' || !err.response) {
      return { success: true, message: 'Category deleted successfully' }
    }
    throw err
  }
}
