const fs = require('fs');
const path = require('path');

// 1. Optimize HomePage.jsx
const homePagePath = path.join(__dirname, '..', 'client', 'src', 'pages', 'public', 'HomePage.jsx');
let homeContent = fs.readFileSync(homePagePath, 'utf8');

// Replace imports
const oldImportStr = `import { getServices } from '../../services/services'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'`;

const newImportStr = `import { getProducts } from '../../services/products'`;

if (homeContent.includes(oldImportStr)) {
  homeContent = homeContent.replace(oldImportStr, newImportStr);
} else if (homeContent.includes(oldImportStr.replace(/\n/g, '\r\n'))) {
  homeContent = homeContent.replace(oldImportStr.replace(/\n/g, '\r\n'), newImportStr.replace(/\n/g, '\r\n'));
}

// Replace state and useEffect
const oldStateBlock = `  const [services, setServices] = useState(null)
  const [categories, setCategories] = useState(null)
  const [allProducts, setAllProducts] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    trackViewHomepage()

    getServices()
      .then((data) => setServices(data || []))
      .catch(() => setServices([]))

    getCategories({ status: 'active', sort: 'display_order_asc' })
      .then((data) => {
        const filteredCategories = (data || []).filter(
          (cat) =>
            !cat.slug?.includes('custom-packaging') &&
            !cat.slug?.includes('luxury-packaging') &&
            !cat.name?.toLowerCase().includes('custom packaging') &&
            !cat.name?.toLowerCase().includes('luxury packaging')
        )
        setCategories(filteredCategories)
      })
      .catch(() => setCategories([]))

    getProducts()
      .then((res) => {
        const list = res?.data || []
        const filteredProducts = list.filter((p) => {
          const catSlug = typeof p.category === 'object' ? p.category?.slug : p.category
          const catName = typeof p.category === 'object' ? p.category?.name : p.category
          return (
            !catSlug?.includes('custom-packaging') &&
            !catSlug?.includes('luxury-packaging') &&
            !catName?.toLowerCase().includes('custom packaging') &&
            !catName?.toLowerCase().includes('luxury packaging')
          )
        })
        const uniqueProducts = Array.from(
          new Map(filteredProducts.map((p) => [p._id || p.slug, p])).values()
        )
        setAllProducts(uniqueProducts)
        const feat = uniqueProducts.filter((p) => p.featured)
        setFeaturedProducts(feat.length > 0 ? feat.slice(0, 4) : uniqueProducts.slice(0, 4))
      })
      .catch(() => {
        setAllProducts([])
        setFeaturedProducts([])
      })

    getPublicBlogs({ limit: 3, sort: 'newest' })
      .then((res) => setBlogs(res?.data || []))
      .catch(() => setBlogs([]))
  }, [])`;

const newStateBlock = `  const [featuredProducts, setFeaturedProducts] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    trackViewHomepage()

    getProducts({ featured: true })
      .then((res) => {
        const list = res?.data || []
        const filteredProducts = list.filter((p) => {
          const catSlug = typeof p.category === 'object' ? p.category?.slug : p.category
          const catName = typeof p.category === 'object' ? p.category?.name : p.category
          return (
            !catSlug?.includes('custom-packaging') &&
            !catSlug?.includes('luxury-packaging') &&
            !catName?.toLowerCase().includes('custom packaging') &&
            !catName?.toLowerCase().includes('luxury packaging')
          )
        })
        const uniqueProducts = Array.from(
          new Map(filteredProducts.map((p) => [p._id || p.slug, p])).values()
        )
        setFeaturedProducts(uniqueProducts.slice(0, 4))
      })
      .catch(() => {
        setFeaturedProducts([])
      })

    getPublicBlogs({ limit: 3, sort: 'newest' })
      .then((res) => setBlogs(res?.data || []))
      .catch(() => setBlogs([]))
  }, [])`;

if (homeContent.includes(oldStateBlock)) {
  homeContent = homeContent.replace(oldStateBlock, newStateBlock);
} else if (homeContent.includes(oldStateBlock.replace(/\n/g, '\r\n'))) {
  homeContent = homeContent.replace(oldStateBlock.replace(/\n/g, '\r\n'), newStateBlock.replace(/\n/g, '\r\n'));
} else {
  console.error('Could not find oldStateBlock in HomePage.jsx');
  process.exit(1);
}

fs.writeFileSync(homePagePath, homeContent, 'utf8');
console.log('Successfully optimized HomePage.jsx');
