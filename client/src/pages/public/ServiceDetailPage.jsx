import { useParams } from 'react-router-dom'
import PagePlaceholder from '../../components/PagePlaceholder'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  return <PagePlaceholder title="Service Detail" note={`slug: ${slug}`} />
}
