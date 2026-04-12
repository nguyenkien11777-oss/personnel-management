import dynamic from 'next/dynamic'

const SwaggerUI = dynamic(
  () => import('swagger-ui-react').then((mod) => ({
    default: mod.default,
    __esModule: true,
  })),
  { ssr: false }
)

export default function SwaggerPage() {
  return (
    <SwaggerUI url="/api/swagger-json" />
  )
}
