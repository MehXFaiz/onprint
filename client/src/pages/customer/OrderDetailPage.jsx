import { useParams } from 'react-router-dom'
import PagePlaceholder from '../../components/PagePlaceholder'

export default function OrderDetailPage() {
  const { id } = useParams()
  return <PagePlaceholder title="Order Detail" note={`order: ${id}`} />
}
