import { Helmet } from 'react-helmet-async'

const SITE = 'https://ahsan-raza.dev'
const abs = (path) => (path && path.startsWith('http') ? path : SITE + (path || ''))

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  article = null,
}) {
  const siteTitle = title ? `${title} | Ahsan Raza` : 'Ahsan Raza — AI Engineer & Builder'
  const siteDesc  = description || 'AI Engineer specializing in machine learning, LLMs, and full-stack AI applications.'
  const siteImage = abs(image || '/og-image.png')
  const siteUrl   = abs(url || '/')

  return (
    <Helmet>
      {/* Primary */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDesc} />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={siteTitle} />
      <meta property="og:description" content={siteDesc} />
      <meta property="og:image"       content={siteImage} />
      <meta property="og:url"         content={siteUrl} />
      <meta property="og:site_name"   content="Ahsan Raza Portfolio" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={siteTitle} />
      <meta name="twitter:description" content={siteDesc} />
      <meta name="twitter:image"       content={siteImage} />

      {/* Article-specific OG tags */}
      {article && <meta property="article:published_time" content={article.publishedAt} />}
      {article?.tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
    </Helmet>
  )
}
