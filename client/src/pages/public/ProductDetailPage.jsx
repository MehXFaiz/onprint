import { useParams } from 'react-router-dom'
import PagePlaceholder from '../../components/PagePlaceholder'

export default function ProductDetailPage() {
  const { slug } = useParams()
  return <PagePlaceholder title="Product Detail" note={`slug: ${slug}`} />
}
