import nextConfig from 'eslint-config-next/core-web-vitals'

const eslintConfig = Array.isArray(nextConfig) ? nextConfig : [nextConfig]

export default eslintConfig
