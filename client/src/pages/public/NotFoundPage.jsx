import Container from '../../components/Container'
import Button from '../../components/Button'
import ArrowLink from '../../components/ArrowLink'
import { CornerMarks } from '../../components/PrintMarks'

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-[75vh] flex-col items-center justify-center py-24 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <CornerMarks className="h-full w-full text-primary/30" />
        <span className="font-display absolute text-2xl font-extrabold text-accent">404</span>
      </div>
      <h1 className="font-display mt-8 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
        This page didn't make it to press.
      </h1>
      <p className="mt-4 max-w-md text-secondary">
        The page you're looking for may have been moved or no longer exists.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
        <Button to="/" variant="accent">
          Back to Home
        </Button>
        <ArrowLink to="/contact">Contact Us</ArrowLink>
      </div>
    </Container>
  )
}
