/**
 * SHOP.CO Centralized Mock Product Catalog
 * Consistent across Homepage, Shop listing, and Product details
 */

const DEFAULT_PRODUCTS = [
  {
    id: "product-001",
    name: "T-shirt with Tape Details",
    category: "T-shirts",
    dressStyle: "Casual",
    gender: "Men",
    description: "Crafted from a soft and breathable cotton fabric, this classic black crewneck t-shirt features a sleek tape detail across the chest, designed to bring out your individuality and modern streetwear flair.",
    price: 699,
    originalPrice: null,
    discountPercent: null,
    rating: 4.5,
    reviewCount: 260,
    colors: ["#000000", "#2B3A42", "#4F4F4F"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/tshirt_tape.jpg",
    galleryImages: [
      "assets/images/products/tshirt_tape.jpg",
      "assets/images/products/one_life_tshirt.jpg",
      "assets/images/products/gradient_tshirt.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-002",
    name: "Skinny Fit Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Men",
    description: "Classic blue washed denim skinny fit jeans tailored for maximum comfort and flexibility. Features premium stretch denim with subtle whiskering and a contemporary slim profile.",
    price: 1499,
    originalPrice: 1899,
    discountPercent: 21,
    rating: 3.5,
    reviewCount: 180,
    colors: ["#2B4C7E", "#1C2D42", "#607274"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/skinny_jeans.jpg",
    galleryImages: [
      "assets/images/products/skinny_jeans.jpg",
      "assets/images/products/faded_skinny_jeans.jpg",
      "assets/images/products/bermuda_shorts.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-003",
    name: "Checkered Shirt",
    category: "Shirts",
    dressStyle: "Casual",
    gender: "Men",
    description: "A timeless red and navy blue plaid checkered long-sleeve casual button-down shirt. Perfect for layering over graphic tees or buttoned up with smart trousers.",
    price: 1199,
    originalPrice: null,
    discountPercent: null,
    rating: 4.5,
    reviewCount: 320,
    colors: ["#A31D1D", "#27445D", "#3B1E54"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/checkered_shirt.jpg",
    galleryImages: [
      "assets/images/products/checkered_shirt.jpg",
      "assets/images/products/vertical_shirt.jpg",
      "assets/images/products/polo_tipping.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-004",
    name: "Sleeve Striped T-shirt",
    category: "T-shirts",
    dressStyle: "Gym",
    description: "High-energy athletic raglan t-shirt in energetic orange with contrasting black sleeves featuring bold sporty sleeve stripes. Lightweight and moisture-wicking.",
    price: 799,
    originalPrice: 1099,
    discountPercent: 27,
    rating: 4.5,
    reviewCount: 140,
    colors: ["#FF6600", "#000000", "#007BFF"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/striped_sleeve.jpg",
    galleryImages: [
      "assets/images/products/striped_sleeve.jpg",
      "assets/images/products/courage_tshirt.jpg",
      "assets/images/products/polo_contrast.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-005",
    name: "Vertical Striped Shirt",
    category: "Shirts",
    dressStyle: "Formal",
    gender: "Men",
    description: "Sophisticated sage green and cream vertical striped long sleeve button up shirt. Expertly tailored from crisp breathable cotton poplin for boardroom or evening elegance.",
    price: 1499,
    originalPrice: 1899,
    discountPercent: 21,
    rating: 5.0,
    reviewCount: 410,
    colors: ["#798645", "#3D5300", "#F2EED7"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/vertical_shirt.jpg",
    galleryImages: [
      "assets/images/products/vertical_shirt.jpg",
      "assets/images/products/checkered_shirt.jpg",
      "assets/images/products/polo_contrast.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-006",
    name: "Courage Graphic T-shirt",
    category: "T-shirts",
    dressStyle: "Casual",
    gender: "Men",
    description: "Vibrant orange relaxed-fit crewneck t-shirt featuring vivid graffiti typography across the front chest reading COURAGE. An unmistakable high-street look.",
    price: 899,
    originalPrice: null,
    discountPercent: null,
    rating: 4.0,
    reviewCount: 195,
    colors: ["#FF5722", "#FF9800", "#212121"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/courage_tshirt.jpg",
    galleryImages: [
      "assets/images/products/courage_tshirt.jpg",
      "assets/images/products/gradient_tshirt.jpg",
      "assets/images/products/striped_sleeve.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-007",
    name: "Loose Fit Bermuda Shorts",
    category: "Shorts",
    dressStyle: "Casual",
    gender: "Men",
    description: "Relaxed summer denim Bermuda shorts cut with a generous comfortable silhouette and clean folded cuffs. Features light vintage enzyme wash.",
    price: 699,
    originalPrice: null,
    discountPercent: null,
    rating: 3.0,
    reviewCount: 92,
    colors: ["#87CEEB", "#4682B4", "#2F4F4F"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/bermuda_shorts.jpg",
    galleryImages: [
      "assets/images/products/bermuda_shorts.jpg",
      "assets/images/products/skinny_jeans.jpg",
      "assets/images/products/faded_skinny_jeans.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-008",
    name: "Faded Skinny Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Men",
    description: "Washed charcoal faded black skinny fit jeans. Made from high recovery comfort stretch denim with authentic hand-applied fade whiskering.",
    price: 1799,
    originalPrice: null,
    discountPercent: null,
    rating: 4.5,
    reviewCount: 350,
    colors: ["#333333", "#111111", "#555555"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/faded_skinny_jeans.jpg",
    galleryImages: [
      "assets/images/products/faded_skinny_jeans.jpg",
      "assets/images/products/skinny_jeans.jpg",
      "assets/images/products/bermuda_shorts.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-009",
    name: "One Life Graphic T-shirt",
    category: "T-shirts",
    dressStyle: "Casual",
    description: "This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style with an embossed gothic typography detail.",
    price: 999,
    originalPrice: 1399,
    discountPercent: 29,
    rating: 4.5,
    reviewCount: 451,
    colors: ["#4F583D", "#314438", "#2E384D"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/one_life_tshirt.jpg",
    galleryImages: [
      "assets/images/products/one_life_tshirt.jpg",
      "assets/images/products/tshirt_tape.jpg",
      "assets/images/products/courage_tshirt.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-010",
    name: "Polo with Contrast Trims",
    category: "T-shirts",
    dressStyle: "Casual",
    description: "Elevated smart-casual cobalt blue pique polo featuring turquoise contrast trims along the ribbed collar and sleeve cuffs. Premium knit cotton.",
    price: 1099,
    originalPrice: 1399,
    discountPercent: 21,
    rating: 4.0,
    reviewCount: 165,
    colors: ["#0056B3", "#008080", "#1C39BB"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/polo_contrast.jpg",
    galleryImages: [
      "assets/images/products/polo_contrast.jpg",
      "assets/images/products/polo_tipping.jpg",
      "assets/images/products/vertical_shirt.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-011",
    name: "Gradient Graphic T-shirt",
    category: "Party",
    dressStyle: "Party",
    description: "Expressive artistic tie-dye spiral gradient graphic t-shirt on pure heavyweight cotton white tee. Eye-catching street statement piece.",
    price: 899,
    originalPrice: 1199,
    discountPercent: 25,
    rating: 3.5,
    reviewCount: 120,
    colors: ["#FFFFFF", "#F5F5F5", "#E0E0E0"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/gradient_tshirt.jpg",
    galleryImages: [
      "assets/images/products/gradient_tshirt.jpg",
      "assets/images/products/courage_tshirt.jpg",
      "assets/images/products/one_life_tshirt.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-012",
    name: "Polo with Tipping Details",
    category: "T-shirts",
    dressStyle: "Casual",
    gender: "Men",
    description: "Understated dusty rose pink cotton pique polo finished with refined navy twin tipping along the collar and cuffs. Ideal for relaxed weekends.",
    price: 1199,
    originalPrice: null,
    discountPercent: null,
    rating: 4.5,
    reviewCount: 210,
    colors: ["#C77C85", "#3A3845", "#F6E7D8"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/polo_tipping.jpg",
    galleryImages: [
      "assets/images/products/polo_tipping.jpg",
      "assets/images/products/polo_contrast.jpg",
      "assets/images/products/checkered_shirt.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-013",
    name: "Black Striped T-shirt",
    category: "T-shirts",
    dressStyle: "Casual",
    description: "Classic monochrome vertical striped crewneck shirt with contrasting dark contrast sleeves. Essential wardrobe foundation.",
    price: 599,
    originalPrice: 849,
    discountPercent: 29,
    rating: 5.0,
    reviewCount: 310,
    colors: ["#000000", "#FFFFFF", "#333333"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/black-striped-tshirt.jpg",
    galleryImages: [
      "assets/images/products/black-striped-tshirt.jpg",
      "assets/images/products/tshirt_tape.jpg",
      "assets/images/products/striped_sleeve.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-014",
    name: "Floral Tiered Summer Dress",
    category: "Kids",
    dressStyle: "Kids",
    description: "Charming floral print tiered summer dress crafted from ultra-soft breathable cotton. Features delicate flutter sleeves, comfortable elasticated waist, and bright blossom accents perfect for sunny days.",
    price: 699,
    originalPrice: 999,
    discountPercent: 30,
    rating: 4.6,
    reviewCount: 142,
    colors: ["#F506A4", "#FFFFFF", "#F5DD06"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/kids/kids-floral-summer-dress.jpg",
    galleryImages: [
      "assets/images/products/kids/kids-floral-summer-dress.jpg",
      "assets/images/products/kids/kids-seasonal-dress.jpg",
      "assets/images/products/kids/kids-cotton-casual-dress.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-015",
    name: "Lilac Bow Organza Party Dress",
    category: "Kids",
    dressStyle: "Kids",
    description: "Whimsical lavender lilac party dress featuring soft organza puff sleeves, embroidered bodice, and an elegant satin front bow. Complete with twirl-worthy tulle petticoat.",
    price: 899,
    originalPrice: 1299,
    discountPercent: 31,
    rating: 4.7,
    reviewCount: 188,
    colors: ["#7D06F5", "#FFFFFF", "#06CAF5"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/kids/kids-party-dress.jpg",
    galleryImages: [
      "assets/images/products/kids/kids-party-dress.jpg",
      "assets/images/products/kids/kids-festive-dress.jpg",
      "assets/images/products/kids/kids-formal-dress.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-016",
    name: "Sunny Gingham Casual Dress",
    category: "Kids",
    dressStyle: "Kids",
    description: "Everyday sunshine yellow gingham check cotton shift dress with front button placket and dual patch pockets. Lightweight, durable, and effortlessly adorable.",
    price: 499,
    originalPrice: 699,
    discountPercent: 29,
    rating: 4.5,
    reviewCount: 95,
    colors: ["#F5DD06", "#FFFFFF", "#F57906"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/kids/kids-cotton-casual-dress.jpg",
    galleryImages: [
      "assets/images/products/kids/kids-cotton-casual-dress.jpg",
      "assets/images/products/kids/kids-floral-summer-dress.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-017",
    name: "Crimson Velvet Festive Dress",
    category: "Kids",
    dressStyle: "Kids",
    description: "Opulent ruby red plush velvet holiday dress with scalloped vintage lace collar, satin waistband bow, and voluminous gathered skirt. Made for memorable family celebrations.",
    price: 999,
    originalPrice: 1399,
    discountPercent: 29,
    rating: 4.9,
    reviewCount: 215,
    colors: ["#F50606", "#000000", "#FFFFFF"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/kids/kids-festive-dress.jpg",
    galleryImages: [
      "assets/images/products/kids/kids-festive-dress.jpg",
      "assets/images/products/kids/kids-party-dress.jpg",
      "assets/images/products/kids/kids-formal-dress.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-018",
    name: "Boys Classic Oxford Shirt & Chinos Set",
    category: "Kids",
    dressStyle: "Kids",
    description: "Smart-casual children's ensemble featuring a tailored sky-blue cotton oxford button-down shirt paired with versatile stretch-cotton beige chino shorts.",
    price: 799,
    originalPrice: 1099,
    discountPercent: 27,
    rating: 4.8,
    reviewCount: 160,
    colors: ["#06CAF5", "#FFFFFF", "#063AF5"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/kids/kids-everyday-outfit.jpg",
    galleryImages: [
      "assets/images/products/kids/kids-everyday-outfit.jpg",
      "assets/images/products/kids/kids-cotton-casual-dress.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-019",
    name: "Ivory Tiered Lace Flower Girl Dress",
    category: "Kids",
    dressStyle: "Kids",
    description: "Exquisite ivory cream tiered floral lace ceremonial gown accented by sheer lace sleeves, a rose quartz satin back ribbon, and delicate scallop hems.",
    price: 1299,
    originalPrice: 1799,
    discountPercent: 28,
    rating: 4.9,
    reviewCount: 230,
    colors: ["#FFFFFF", "#F506A4"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/kids/kids-formal-dress.jpg",
    galleryImages: [
      "assets/images/products/kids/kids-formal-dress.jpg",
      "assets/images/products/kids/kids-party-dress.jpg",
      "assets/images/products/kids/kids-occasion-wear.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-020",
    name: "Sky Blue Smocked Flutter Sundress",
    category: "Kids",
    dressStyle: "Kids",
    description: "Vibrant Mediterranean sky-blue sundress showcasing an elastic smocked bodice, floral print tiered skirts, and ruffled shoulder flutter straps.",
    price: 599,
    originalPrice: null,
    discountPercent: null,
    rating: 4.6,
    reviewCount: 112,
    colors: ["#06CAF5", "#FFFFFF", "#063AF5"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/kids/kids-seasonal-dress.jpg",
    galleryImages: [
      "assets/images/products/kids/kids-seasonal-dress.jpg",
      "assets/images/products/kids/kids-floral-summer-dress.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-021",
    name: "Emerald Flutter Satin Gala Dress",
    category: "Kids",
    dressStyle: "Kids",
    description: "Regal jewel-tone emerald green lustrous satin party dress with structured flutter sleeves, golden buckle accent, and box-pleated A-line silhouette.",
    price: 1099,
    originalPrice: 1499,
    discountPercent: 27,
    rating: 4.8,
    reviewCount: 176,
    colors: ["#00C12B", "#F5DD06", "#000000"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/kids/kids-occasion-wear.jpg",
    galleryImages: [
      "assets/images/products/kids/kids-occasion-wear.jpg",
      "assets/images/products/kids/kids-festive-dress.jpg",
      "assets/images/products/kids/kids-party-dress.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-022",
    name: "Slim-Fit Black Business Suit",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Men",
    description: "Sleek tailored black business suit cut from high-grade wool blend. Features hand-finished notched lapels, two-button jacket closure, and matching slim flat-front dress trousers.",
    price: 6999,
    originalPrice: 8999,
    discountPercent: 22,
    rating: 4.9,
    reviewCount: 312,
    colors: ["#000000", "#1C2833", "#2C3E50"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-black-business-suit.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-black-business-suit.jpg",
      "assets/images/products/formal/formal-mens-classic-white-shirt.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-023",
    name: "Classic White Formal Shirt",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Men",
    description: "Impeccably tailored pure Egyptian cotton dress shirt in optic white. Features semi-spread structured collar, mother-of-pearl buttons, and French cuffs for executive occasions.",
    price: 1599,
    originalPrice: 1999,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 245,
    colors: ["#FFFFFF", "#F0F3F4"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-classic-white-shirt.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-classic-white-shirt.jpg",
      "assets/images/products/formal/formal-mens-black-business-suit.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-024",
    name: "Tailored Formal Trousers",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Men",
    description: "Executive charcoal gray formal dress trousers crafted with a crisp front crease, taped interior waistband, and tapered modern cut.",
    price: 1999,
    originalPrice: 2599,
    discountPercent: 23,
    rating: 4.7,
    reviewCount: 168,
    colors: ["#2C3E50", "#1C2833", "#566573"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-tailored-trousers.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-tailored-trousers.jpg",
      "assets/images/products/formal/formal-mens-navy-office-blazer.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-025",
    name: "Navy Blue Office Blazer",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Men",
    description: "Versatile dark navy wool-twill office blazer. Soft shoulder construction, horn-style buttons, double back vent, and interior ticket pocket.",
    price: 4499,
    originalPrice: 5999,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 198,
    colors: ["#1B4F72", "#154360", "#17202A"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-navy-office-blazer.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-navy-office-blazer.jpg",
      "assets/images/products/formal/formal-mens-classic-white-shirt.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-026",
    name: "Three-Piece Formal Suit with Waistcoat",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Men",
    description: "Complete 3-piece sartorial charcoal gray suit comprising a single-breasted five-button vest, tailored jacket, and matching pressed formal trousers.",
    price: 8999,
    originalPrice: 11999,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 220,
    colors: ["#2D3436", "#17202A"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-threepiece-suit.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-threepiece-suit.jpg",
      "assets/images/products/formal/formal-mens-waistcoat.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-027",
    name: "Premium Formal Shirt & Trousers Combination",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Men",
    description: "Curated boardroom ensemble including a light blue pin-point cotton shirt paired with midnight navy tapered flat-front dress slacks.",
    price: 3499,
    originalPrice: 4499,
    discountPercent: 22,
    rating: 4.6,
    reviewCount: 145,
    colors: ["#2980B9", "#2C3E50"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-shirt-trousers-combo.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-shirt-trousers-combo.jpg",
      "assets/images/products/formal/formal-mens-classic-white-shirt.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-028",
    name: "Elegant Formal Waistcoat",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Men",
    description: "Tailored V-neck waistcoat in fine charcoal worsted wool. Features satin-faced back lining, adjustable cinching buckle, and welt watch pocket.",
    price: 1799,
    originalPrice: 2299,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 130,
    colors: ["#34495E", "#1B2631"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-waistcoat.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-waistcoat.jpg",
      "assets/images/products/formal/formal-mens-threepiece-suit.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-029",
    name: "Women's Elegant Black Office Blazer",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Women",
    description: "Precision-tailored black power blazer with structured shoulders, peak lapels, and a flattering contoured waistline. A cornerstone of executive wardrobes.",
    price: 3499,
    originalPrice: 4499,
    discountPercent: 22,
    rating: 4.9,
    reviewCount: 284,
    colors: ["#000000", "#1C2833"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/formal/formal-womens-office-blazer.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-womens-office-blazer.jpg",
      "assets/images/products/formal/formal-womens-tailored-trousers.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-030",
    name: "Women's Tailored Formal Trousers",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Women",
    description: "High-rise straight-leg trousers with sharp front creases, hidden zip fly, and comfort stretch wool composition. Seamlessly transitions from day meetings to evening events.",
    price: 1999,
    originalPrice: 2599,
    discountPercent: 23,
    rating: 4.8,
    reviewCount: 204,
    colors: ["#2C3E50", "#000000", "#7F8C8D"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/formal/formal-womens-tailored-trousers.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-womens-tailored-trousers.jpg",
      "assets/images/products/formal/formal-womens-office-blazer.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-031",
    name: "Sophisticated Office Sheath Dress",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Women",
    description: "Immaculate knee-length tailored sheath dress in deep emerald crepe. Features elegant boat neckline, capped sleeves, and waist darts for architectural elegance.",
    price: 2999,
    originalPrice: 3999,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 192,
    colors: ["#145A32", "#1C2833", "#7D6608"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/formal/formal-womens-sophisticated-dress.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-womens-sophisticated-dress.jpg",
      "assets/images/products/formal/formal-womens-office-blazer.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-032",
    name: "Women's Blazer and Trouser Suit Set",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Women",
    description: "Coordinated two-piece power pantsuit in warm camel beige. Includes an oversized single-breasted blazer and matching wide-leg trousers.",
    price: 4999,
    originalPrice: 6499,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 260,
    colors: ["#BA7234", "#1C2833"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/formal/formal-womens-blazer-trouser-set.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-womens-blazer-trouser-set.jpg",
      "assets/images/products/formal/formal-womens-white-blouse.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-033",
    name: "Classic White Formal Blouse",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Women",
    description: "Luxurious silk chiffon button-up blouse in pristine ivory white. Accented with subtle neck tie detail and concealed button placket for a clean minimalist profile.",
    price: 1499,
    originalPrice: 1999,
    discountPercent: 25,
    rating: 4.7,
    reviewCount: 175,
    colors: ["#FFFFFF", "#FDFEFE"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/formal/formal-womens-white-blouse.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-womens-white-blouse.jpg",
      "assets/images/products/formal/formal-womens-pencil-skirt.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-034",
    name: "Elegant High-Waisted Pencil Skirt",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Women",
    description: "Contour-fit high-waisted pencil skirt in black stretch wool. Knee-length silhouette with discreet back walking vent and clean concealed side zipper.",
    price: 1299,
    originalPrice: 1699,
    discountPercent: 24,
    rating: 4.6,
    reviewCount: 154,
    colors: ["#212F3D", "#000000"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/formal/formal-womens-pencil-skirt.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-womens-pencil-skirt.jpg",
      "assets/images/products/formal/formal-womens-white-blouse.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-035",
    name: "Women's Navy Blue Business Suit",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Women",
    description: "Two-piece navy blue executive suit featuring a single-button fitted jacket and tailored slim ankle trousers made from Italian stretch wool.",
    price: 5499,
    originalPrice: 6999,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 210,
    colors: ["#154360", "#1B2631"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/formal/formal-womens-navy-business-suit.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-womens-navy-business-suit.jpg",
      "assets/images/products/formal/formal-womens-white-blouse.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-036",
    name: "Women's Premium Shirt & Trouser Combination",
    category: "Formal",
    dressStyle: "Formal",
    gender: "Women",
    description: "Crisp white tailored stretch cotton shirt paired with charcoal flare-leg dress slacks for an effortlessly refined 9-to-5 aesthetic.",
    price: 2999,
    originalPrice: 3799,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 165,
    colors: ["#FFFFFF", "#2E4053"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/formal/formal-womens-shirt-trouser-combo.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-womens-shirt-trouser-combo.jpg",
      "assets/images/products/formal/formal-womens-office-blazer.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-037",
    name: "Men's Relaxed-Fit Cargo Trousers",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Men",
    description: "Utilitarian olive green heavy-duty cotton twill cargo trousers with multi-pocket detailing, reinforced knee panels, and adjustable drawstring ankle cuffs.",
    price: 1799,
    originalPrice: 2299,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 184,
    colors: ["#3E4E39", "#212F3D"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/casual/casual-mens-cargo-trousers.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-mens-cargo-trousers.jpg",
      "assets/images/products/casual/casual-mens-denim-jacket.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-038",
    name: "Men's Casual Denim Jacket",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Men",
    description: "Authentic indigo stonewash trucker denim jacket featuring brass shank buttons, dual chest flap pockets, and adjustable waist tabs.",
    price: 2499,
    originalPrice: 2999,
    discountPercent: 17,
    rating: 4.8,
    reviewCount: 225,
    colors: ["#2980B9", "#1B4F72"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/casual/casual-mens-denim-jacket.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-mens-denim-jacket.jpg",
      "assets/images/products/casual/casual-mens-cargo-trousers.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-039",
    name: "Women's Oversized Graphic T-Shirt",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Women",
    description: "Relaxed slouchy boyfriend-fit graphic tee crafted from combed organic jersey cotton with a vintage washed lilac botanical artwork print.",
    price: 999,
    originalPrice: 1299,
    discountPercent: 23,
    rating: 4.8,
    reviewCount: 195,
    colors: ["#8E44AD", "#FFFFFF", "#2C3E50"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/casual/casual-womens-oversized-graphic-tee.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-womens-oversized-graphic-tee.jpg",
      "assets/images/products/casual/casual-womens-highwaist-jeans.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-040",
    name: "Women's Stylish Casual Crop T-Shirt",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Women",
    description: "Modern baby-tee silhouette in pastel lavender rib-knit cotton with crew neckline and micro-lettuce hemline. Ideal pair with high-waisted denim.",
    price: 599,
    originalPrice: null,
    discountPercent: null,
    rating: 4.6,
    reviewCount: 142,
    colors: ["#9B59B6", "#FFFFFF", "#F5EEF8"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/casual/casual-womens-crop-tshirt.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-womens-crop-tshirt.jpg",
      "assets/images/products/casual/casual-womens-highwaist-jeans.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-041",
    name: "Women's High-Waisted Denim Jeans",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Women",
    description: "Vintage light stone-washed rigid mom jeans engineered with a flattering high-rise contour waist, relaxed tapered leg, and classic 5-pocket styling.",
    price: 1899,
    originalPrice: 2499,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 310,
    colors: ["#3498DB", "#2E4053", "#1B2631"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/casual/casual-womens-highwaist-jeans.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-womens-highwaist-jeans.jpg",
      "assets/images/products/casual/casual-womens-crop-tshirt.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-042",
    name: "Women's Comfortable Casual Hoodie",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Women",
    description: "Cozy brushed-fleece pullover hoodie in soft blush rose. Features drop shoulders, deep kangaroo pouch pocket, and chunky tonal drawstrings.",
    price: 1799,
    originalPrice: 2399,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 228,
    colors: ["#DB7093", "#FADBD8", "#2C3E50"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/casual/casual-womens-comfort-hoodie.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-womens-comfort-hoodie.jpg",
      "assets/images/products/casual/casual-womens-highwaist-jeans.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-043",
    name: "Women's Relaxed-Fit Casual Shirt",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Women",
    description: "Effortless lightweight linen-cotton blend casual button-down shirt in natural oatmeal beige. Designed with a loose boyfriend drape and patch chest pocket.",
    price: 1299,
    originalPrice: null,
    discountPercent: null,
    rating: 4.7,
    reviewCount: 160,
    colors: ["#A08264", "#FFFFFF"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/casual/casual-womens-relaxed-shirt.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-womens-relaxed-shirt.jpg",
      "assets/images/products/casual/casual-womens-wide-leg-trousers.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-044",
    name: "Women's Casual Wide-Leg Trousers",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Women",
    description: "Flowy sand beige pleated trousers crafted from breathable tencel twill. Comfortable elastic back waistband with an elegant front drape.",
    price: 1599,
    originalPrice: 2099,
    discountPercent: 24,
    rating: 4.7,
    reviewCount: 178,
    colors: ["#B39573", "#1C2833"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/casual/casual-womens-wide-leg-trousers.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-womens-wide-leg-trousers.jpg",
      "assets/images/products/casual/casual-womens-relaxed-shirt.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-045",
    name: "Women's Lightweight Denim Jacket",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Women",
    description: "Cropped trucker denim jacket in light vintage wash featuring gentle distressing, frayed raw hem, and antique copper buttons.",
    price: 2299,
    originalPrice: 2999,
    discountPercent: 23,
    rating: 4.8,
    reviewCount: 215,
    colors: ["#4682B4", "#1F618D"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/casual/casual-womens-denim-jacket.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-womens-denim-jacket.jpg",
      "assets/images/products/casual/casual-womens-summer-dress.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-046",
    name: "Women's Casual Summer Sun Dress",
    category: "Casual",
    dressStyle: "Casual",
    gender: "Women",
    description: "Breezy tiered midi sundress featuring a sweetheart neckline, adjustable tie straps, and sunny lemon yellow floral motif on breathable cotton.",
    price: 1299,
    originalPrice: 1699,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 240,
    colors: ["#E6A014", "#FFFFFF"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/casual/casual-womens-summer-dress.jpg",
    galleryImages: [
      "assets/images/products/casual/casual-womens-summer-dress.jpg",
      "assets/images/products/casual/casual-womens-denim-jacket.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-047",
    name: "Black Sequin Party Dress",
    category: "Party",
    dressStyle: "Party",
    gender: "Women",
    description: "Glamorous all-over black sequin mini dress with a sleek crew neckline and bodycon silhouette. Designed to capture every light in the room. Perfect for parties, galas, and night-outs.",
    price: 3499,
    originalPrice: 4499,
    discountPercent: 22,
    rating: 4.9,
    reviewCount: 312,
    colors: ["#000000", "#1C1C1C"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/party/party-womens-black-sequin-dress.jpg",
    galleryImages: [
      "assets/images/products/party/party-womens-black-sequin-dress.jpg",
      "assets/images/products/party/party-womens-red-evening-dress.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-048",
    name: "Red Satin Evening Dress",
    category: "Party",
    dressStyle: "Party",
    gender: "Women",
    description: "Floor-length scarlet red strapless evening gown with a sweetheart neckline, boned corset bodice, and elegant A-line skirt in lustrous satin. A show-stopping statement piece.",
    price: 5999,
    originalPrice: 7999,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 274,
    colors: ["#C0392B", "#922B21"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/party/party-womens-red-evening-dress.jpg",
    galleryImages: [
      "assets/images/products/party/party-womens-red-evening-dress.jpg",
      "assets/images/products/party/party-womens-elegant-evening-gown.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-049",
    name: "Emerald Satin Cocktail Dress",
    category: "Party",
    dressStyle: "Party",
    gender: "Women",
    description: "Knee-length emerald green satin cocktail dress with a draped cowl neckline and streamlined silhouette. Crafted from high-sheen duchess satin for a luxurious evening look.",
    price: 2999,
    originalPrice: 3999,
    discountPercent: 25,
    rating: 4.7,
    reviewCount: 198,
    colors: ["#1E8449", "#145A32"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/party/party-womens-satin-cocktail-dress.jpg",
    galleryImages: [
      "assets/images/products/party/party-womens-satin-cocktail-dress.jpg",
      "assets/images/products/party/party-womens-black-sequin-dress.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-050",
    name: "Navy Elegant Evening Gown",
    category: "Party",
    dressStyle: "Party",
    gender: "Women",
    description: "Sophisticated navy blue floor-length sleeveless evening gown with a jewel-embellished neckline and flowing chiffon skirt with a graceful high slit. Formal elegance redefined.",
    price: 7499,
    originalPrice: 9499,
    discountPercent: 21,
    rating: 4.9,
    reviewCount: 245,
    colors: ["#154360", "#1B2631"],
    sizes: ["Small", "Medium", "Large"],
    image: "assets/images/products/party/party-womens-elegant-evening-gown.jpg",
    galleryImages: [
      "assets/images/products/party/party-womens-elegant-evening-gown.jpg",
      "assets/images/products/party/party-womens-red-evening-dress.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-051",
    name: "Men's Velvet Party Blazer",
    category: "Party",
    dressStyle: "Party",
    gender: "Men",
    description: "Premium single-breasted burgundy velvet blazer with satin lapels and a tailored slim fit. Pairs perfectly with a crisp white dress shirt and slim black trousers for a distinguished party look.",
    price: 4999,
    originalPrice: 6499,
    discountPercent: 23,
    rating: 4.8,
    reviewCount: 185,
    colors: ["#6E2C3E", "#1C2833"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-navy-office-blazer.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-navy-office-blazer.jpg",
      "assets/images/products/formal/formal-mens-classic-white-shirt.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-052",
    name: "Men's Premium Party Shirt & Trousers",
    category: "Party",
    dressStyle: "Party",
    gender: "Men",
    description: "Elevated party ensemble featuring a slim-fit satin dress shirt in champagne ivory paired with tailored midnight navy suit trousers. A refined look for any formal gathering.",
    price: 3299,
    originalPrice: 4299,
    discountPercent: 23,
    rating: 4.6,
    reviewCount: 152,
    colors: ["#F5CBA7", "#1B2631"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-shirt-trousers-combo.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-shirt-trousers-combo.jpg",
      "assets/images/products/formal/formal-mens-waistcoat.jpg"
    ],
    isNewArrival: false,
    isTopSelling: false
  },
  {
    id: "product-053",
    name: "Men's Modern Party Suit",
    category: "Party",
    dressStyle: "Party",
    gender: "Men",
    description: "Sharp two-piece party suit in sleek midnight black with a peak lapel jacket and flat-front slim trousers. Cut from premium stretch wool blend for all-night comfort and style.",
    price: 7499,
    originalPrice: 9499,
    discountPercent: 21,
    rating: 4.9,
    reviewCount: 228,
    colors: ["#000000", "#17202A"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-black-business-suit.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-black-business-suit.jpg",
      "assets/images/products/formal/formal-mens-threepiece-suit.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-054",
    name: "Men's Festive Three-Piece Suit",
    category: "Party",
    dressStyle: "Party",
    gender: "Men",
    description: "Complete festive three-piece suit in classic charcoal grey. Includes a tailored jacket, waistcoat, and matching dress trousers — a timeless formal-party combination for galas and events.",
    price: 9999,
    originalPrice: 12999,
    discountPercent: 23,
    rating: 4.8,
    reviewCount: 196,
    colors: ["#2D3436", "#1C2833"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/formal/formal-mens-threepiece-suit.jpg",
    galleryImages: [
      "assets/images/products/formal/formal-mens-threepiece-suit.jpg",
      "assets/images/products/formal/formal-mens-waistcoat.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },

  // ==========================================
  // JEANS COLLECTION EXPANSION (product-055 to product-060)
  // (Plus existing product-002 and product-008 = 8 Jeans products)
  // ==========================================
  {
    id: "product-055",
    name: "Men's Slim-Fit Blue Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Men",
    description: "Modern indigo mid-wash slim-fit denim jeans with premium stretch retention, authentic hand-buffed fading, and classic five-pocket copper-riveted styling.",
    price: 1899,
    originalPrice: 2499,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 242,
    colors: ["#2B4C7E", "#1C2D42", "#4A6572"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/jeans/mens-slim-fit-blue-jeans.jpg",
    galleryImages: [
      "assets/images/products/jeans/mens-slim-fit-blue-jeans.jpg",
      "assets/images/products/jeans/mens-classic-straight-jeans.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-056",
    name: "Men's Classic Straight-Leg Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Men",
    description: "Timeless straight-leg silhouette crafted from authentic 12.5 oz durable indigo cotton denim. Features a comfortable regular rise and clean hemline.",
    price: 1799,
    originalPrice: 2299,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 198,
    colors: ["#2980B9", "#2C3E50", "#566573"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/jeans/mens-classic-straight-jeans.jpg",
    galleryImages: [
      "assets/images/products/jeans/mens-classic-straight-jeans.jpg",
      "assets/images/products/jeans/mens-relaxed-fit-denim.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-057",
    name: "Men's Black Slim Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Men",
    description: "Stay-black saturated denim tailored in a clean, contemporary slim fit. Soft stay-color cotton weave with elastane ensures all-day sharp style and comfort.",
    price: 1999,
    originalPrice: 2599,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 310,
    colors: ["#111111", "#212121", "#37474F"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/jeans/mens-black-slim-jeans.jpg",
    galleryImages: [
      "assets/images/products/jeans/mens-black-slim-jeans.jpg",
      "assets/images/products/jeans/mens-slim-fit-blue-jeans.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-058",
    name: "Men's Relaxed-Fit Denim Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Men",
    description: "Easy-going relaxed fit denim with a subtle vintage light wash. Loose through the seat and thigh with an easy straight leg for everyday laid-back style.",
    price: 1699,
    originalPrice: 2199,
    discountPercent: 23,
    rating: 4.6,
    reviewCount: 164,
    colors: ["#5DADE2", "#34495E", "#85929E"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/jeans/mens-relaxed-fit-denim.jpg",
    galleryImages: [
      "assets/images/products/jeans/mens-relaxed-fit-denim.jpg",
      "assets/images/products/jeans/mens-classic-straight-jeans.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-059",
    name: "Women's High-Waisted Skinny Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Women",
    description: "Sculpting high-rise contour waistband with premium stretch recovery denim in deep dark indigo. Hugs the curves smoothly from hip to ankle.",
    price: 1999,
    originalPrice: 2599,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 388,
    colors: ["#1F3A60", "#17202A", "#2E4053"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/jeans/womens-highwaist-skinny-jeans.jpg",
    galleryImages: [
      "assets/images/products/jeans/womens-highwaist-skinny-jeans.jpg",
      "assets/images/products/jeans/womens-wide-leg-blue-jeans.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-060",
    name: "Women's Wide-Leg Blue Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Women",
    description: "Effortless 90s-inspired wide-leg silhouette in mid-blue vintage wash. Crafted from breathable cotton denim with a flattering high-waist rise.",
    price: 2199,
    originalPrice: 2799,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 276,
    colors: ["#3498DB", "#2874A6", "#1B4F72"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/jeans/womens-wide-leg-blue-jeans.jpg",
    galleryImages: [
      "assets/images/products/jeans/womens-wide-leg-blue-jeans.jpg",
      "assets/images/products/jeans/womens-highwaist-skinny-jeans.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-061",
    name: "Women's Straight-Leg Vintage Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Women",
    description: "Authentic vintage wash denim featuring a clean straight leg, high rise waist, and subtle lived-in fading. The quintessential everyday wardrobe essential.",
    price: 1899,
    originalPrice: 2399,
    discountPercent: 21,
    rating: 4.7,
    reviewCount: 192,
    colors: ["#5DADE2", "#2E4053", "#1B2631"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/jeans/womens-straight-vintage-jeans.jpg",
    galleryImages: [
      "assets/images/products/jeans/womens-straight-vintage-jeans.jpg",
      "assets/images/products/jeans/womens-black-flared-jeans.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-062",
    name: "Women's Black Flared Jeans",
    category: "Jeans",
    dressStyle: "Casual",
    gender: "Women",
    description: "Sleek retro-inspired flared silhouette in pitch black stretch denim. Fitted through the thigh and gently widening from the knee down for an elongated look.",
    price: 2299,
    originalPrice: 2899,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 215,
    colors: ["#17202A", "#212F3D", "#000000"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/jeans/womens-black-flared-jeans.jpg",
    galleryImages: [
      "assets/images/products/jeans/womens-black-flared-jeans.jpg",
      "assets/images/products/jeans/womens-highwaist-skinny-jeans.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },

  // ==========================================
  // SHORTS COLLECTION EXPANSION (product-063 to product-069)
  // (Plus existing product-007 = 8 Shorts products)
  // ==========================================
  {
    id: "product-063",
    name: "Men's Classic Chino Shorts",
    category: "Shorts",
    dressStyle: "Casual",
    gender: "Men",
    description: "Tailored flat-front cotton stretch chino shorts in refined sand beige. Features slash side pockets, welt back pockets, and an optimal 9-inch inseam.",
    price: 999,
    originalPrice: 1399,
    discountPercent: 29,
    rating: 4.7,
    reviewCount: 185,
    colors: ["#D4B996", "#2C3E50", "#3E4E39"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/shorts/mens-classic-chino-shorts.jpg",
    galleryImages: [
      "assets/images/products/shorts/mens-classic-chino-shorts.jpg",
      "assets/images/products/shorts/mens-relaxed-denim-shorts.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-064",
    name: "Men's Relaxed-Fit Denim Shorts",
    category: "Shorts",
    dressStyle: "Casual",
    gender: "Men",
    description: "Casual summer denim shorts with authentic vintage wash and raw rolled cuffs. Cut loose through the thigh for breezy comfort on warm afternoons.",
    price: 899,
    originalPrice: 1199,
    discountPercent: 25,
    rating: 4.6,
    reviewCount: 142,
    colors: ["#5DADE2", "#2E4053"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/shorts/mens-relaxed-denim-shorts.jpg",
    galleryImages: [
      "assets/images/products/shorts/mens-relaxed-denim-shorts.jpg",
      "assets/images/products/shorts/mens-casual-cargo-shorts.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-065",
    name: "Men's Athletic Training Shorts",
    category: "Shorts",
    dressStyle: "Casual",
    gender: "Men",
    description: "Engineered performance lightweight workout shorts with breathable mesh side panels, elasticized waistband, reflective accents, and deep zip pockets.",
    price: 799,
    originalPrice: 1099,
    discountPercent: 27,
    rating: 4.8,
    reviewCount: 220,
    colors: ["#1B2631", "#2874A6", "#566573"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/shorts/mens-athletic-training-shorts.jpg",
    galleryImages: [
      "assets/images/products/shorts/mens-athletic-training-shorts.jpg",
      "assets/images/products/shorts/mens-classic-chino-shorts.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-066",
    name: "Men's Casual Cargo Shorts",
    category: "Shorts",
    dressStyle: "Casual",
    gender: "Men",
    description: "Rugged military-inspired cotton twill cargo shorts with bellows cargo pockets, reinforced seams, and sturdy button-flap closures.",
    price: 1099,
    originalPrice: 1499,
    discountPercent: 27,
    rating: 4.7,
    reviewCount: 168,
    colors: ["#3E4E39", "#8D6E63", "#212F3D"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/shorts/mens-casual-cargo-shorts.jpg",
    galleryImages: [
      "assets/images/products/shorts/mens-casual-cargo-shorts.jpg",
      "assets/images/products/shorts/mens-classic-chino-shorts.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-067",
    name: "Women's High-Waisted Denim Shorts",
    category: "Shorts",
    dressStyle: "Casual",
    gender: "Women",
    description: "Summer staple high-rise denim shorts with gentle distressing, copper hardware, and a classic 5-pocket design. Pairs perfectly with crops and tees.",
    price: 899,
    originalPrice: 1199,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 284,
    colors: ["#3498DB", "#1B4F72", "#EAECEE"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/shorts/womens-highwaist-denim-shorts.jpg",
    galleryImages: [
      "assets/images/products/shorts/womens-highwaist-denim-shorts.jpg",
      "assets/images/products/shorts/womens-tailored-summer-shorts.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-068",
    name: "Women's Tailored Summer Shorts",
    category: "Shorts",
    dressStyle: "Casual",
    gender: "Women",
    description: "Chic pleated summer city shorts with a belted waist and structured drape. Elegant enough for brunch outings or smart warm-weather dressing.",
    price: 1199,
    originalPrice: 1599,
    discountPercent: 25,
    rating: 4.7,
    reviewCount: 156,
    colors: ["#D4AC0D", "#F4F6F6", "#2C3E50"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/shorts/womens-tailored-summer-shorts.jpg",
    galleryImages: [
      "assets/images/products/shorts/womens-tailored-summer-shorts.jpg",
      "assets/images/products/shorts/womens-relaxed-linen-shorts.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },
  {
    id: "product-069",
    name: "Women's Relaxed Linen Shorts",
    category: "Shorts",
    dressStyle: "Casual",
    gender: "Women",
    description: "Breezy natural flax linen blend shorts featuring an elasticated drawstring waistband, wide leg cuffs, and breezy featherlight feel.",
    price: 999,
    originalPrice: 1299,
    discountPercent: 23,
    rating: 4.8,
    reviewCount: 195,
    colors: ["#F5EEF8", "#E5E7E9", "#A08264"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/shorts/womens-relaxed-linen-shorts.jpg",
    galleryImages: [
      "assets/images/products/shorts/womens-relaxed-linen-shorts.jpg",
      "assets/images/products/shorts/womens-casual-cotton-shorts.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-070",
    name: "Women's Casual Cotton Shorts",
    category: "Shorts",
    dressStyle: "Casual",
    gender: "Women",
    description: "Ultra-comfortable soft combed-cotton everyday shorts with side slit hems and dual deep slash pockets. Essential for sunny weekend lounge days.",
    price: 699,
    originalPrice: 899,
    discountPercent: 22,
    rating: 4.6,
    reviewCount: 130,
    colors: ["#BDC3C7", "#2C3E50", "#E74C3C"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/shorts/womens-casual-cotton-shorts.jpg",
    galleryImages: [
      "assets/images/products/shorts/womens-casual-cotton-shorts.jpg",
      "assets/images/products/shorts/womens-highwaist-denim-shorts.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  },

  // ==========================================
  // HOODIE COLLECTION EXPANSION (product-071 to product-078)
  // (8 distinct Hoodie products: 4 Men's, 4 Women's)
  // ==========================================
  {
    id: "product-071",
    name: "Men's Classic Pullover Hoodie",
    category: "Hoodie",
    dressStyle: "Casual",
    gender: "Men",
    description: "Heavyweight 380 GSM combed-cotton fleece pullover hoodie in deep slate grey. Double-lined hood, reinforced pouch pocket, and rib-knit cuffs.",
    price: 1899,
    originalPrice: 2499,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 312,
    colors: ["#2C3E50", "#1C2833", "#7F8C8D"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/hoodie/mens-classic-pullover-hoodie.jpg",
    galleryImages: [
      "assets/images/products/hoodie/mens-classic-pullover-hoodie.jpg",
      "assets/images/products/hoodie/mens-zip-up-fleece-hoodie.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-072",
    name: "Men's Zip-Up Fleece Hoodie",
    category: "Hoodie",
    dressStyle: "Casual",
    gender: "Men",
    description: "Everyday zip-front hoodie crafted from thermal brushed fleece. Features a full-length metal zipper, split kangaroo pockets, and high storm neck.",
    price: 1999,
    originalPrice: 2699,
    discountPercent: 26,
    rating: 4.7,
    reviewCount: 228,
    colors: ["#1B2631", "#2E4053", "#95A5A6"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/hoodie/mens-zip-up-fleece-hoodie.jpg",
    galleryImages: [
      "assets/images/products/hoodie/mens-zip-up-fleece-hoodie.jpg",
      "assets/images/products/hoodie/mens-oversized-streetwear-hoodie.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-073",
    name: "Men's Oversized Streetwear Hoodie",
    category: "Hoodie",
    dressStyle: "Casual",
    gender: "Men",
    description: "Boxy dropped-shoulder silhouette engineered for trendsetting street aesthetics. Thick loopback French terry with tonal minimal chest embroidery.",
    price: 2299,
    originalPrice: 2999,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 345,
    colors: ["#34495E", "#111111", "#E67E22"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/hoodie/mens-oversized-streetwear-hoodie.jpg",
    galleryImages: [
      "assets/images/products/hoodie/mens-oversized-streetwear-hoodie.jpg",
      "assets/images/products/hoodie/mens-classic-pullover-hoodie.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-074",
    name: "Men's Minimalist Cotton Hoodie",
    category: "Hoodie",
    dressStyle: "Casual",
    gender: "Men",
    description: "Clean aesthetic pullover hooded sweatshirt in premium organic pima cotton. Features hidden side-seam pockets and metal-tipped tonal drawcords.",
    price: 1799,
    originalPrice: 2299,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 174,
    colors: ["#7F8C8D", "#FFFFFF", "#1B2631"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/hoodie/mens-minimalist-cotton-hoodie.jpg",
    galleryImages: [
      "assets/images/products/hoodie/mens-minimalist-cotton-hoodie.jpg",
      "assets/images/products/hoodie/mens-classic-pullover-hoodie.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-075",
    name: "Women's Cropped Pullover Hoodie",
    category: "Hoodie",
    dressStyle: "Casual",
    gender: "Women",
    description: "Sporty-chic cropped fleece hoodie featuring a relaxed raw-edge hem, dropped shoulders, and ultra-soft cloud-brushed cotton interior.",
    price: 1599,
    originalPrice: 2099,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 265,
    colors: ["#E8DAEF", "#FADBD8", "#2C3E50"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/hoodie/womens-cropped-pullover-hoodie.jpg",
    galleryImages: [
      "assets/images/products/hoodie/womens-cropped-pullover-hoodie.jpg",
      "assets/images/products/hoodie/womens-oversized-beige-hoodie.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-076",
    name: "Women's Oversized Beige Hoodie",
    category: "Hoodie",
    dressStyle: "Casual",
    gender: "Women",
    description: "Cozy warm oatmeal beige oversized hoodie tailored for relaxed comfort. Features an oversized roomy hood, slouchy sleeves, and deep kangaroo pocket.",
    price: 1899,
    originalPrice: 2499,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 318,
    colors: ["#F5EEF8", "#EDBB99", "#2C3E50"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/hoodie/womens-oversized-beige-hoodie.jpg",
    galleryImages: [
      "assets/images/products/hoodie/womens-oversized-beige-hoodie.jpg",
      "assets/images/products/hoodie/womens-relaxed-fit-fleece-hoodie.jpg"
    ],
    isNewArrival: true,
    isTopSelling: true
  },
  {
    id: "product-077",
    name: "Women's Zip-Up Casual Hoodie",
    category: "Hoodie",
    dressStyle: "Casual",
    gender: "Women",
    description: "Versatile zip-up layering hoodie in breathable stretch cotton French terry. Designed with a smooth glide zipper, high neck collar, and ribbed cuffs.",
    price: 1799,
    originalPrice: 2299,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 198,
    colors: ["#34495E", "#AAB7B8", "#17202A"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/hoodie/womens-zip-up-casual-hoodie.jpg",
    galleryImages: [
      "assets/images/products/hoodie/womens-zip-up-casual-hoodie.jpg",
      "assets/images/products/hoodie/womens-cropped-pullover-hoodie.jpg"
    ],
    isNewArrival: false,
    isTopSelling: true
  },
  {
    id: "product-078",
    name: "Women's Relaxed-Fit Fleece Hoodie",
    category: "Hoodie",
    dressStyle: "Casual",
    gender: "Women",
    description: "Plush organic cotton fleece hoodie in gentle blush rose. Features an ultra-soft brushed lining, roomy hood with wide drawstrings, and ribbed hem.",
    price: 1899,
    originalPrice: 2499,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 340,
    colors: ["#FADBD8", "#D7BDE2", "#2C3E50"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    image: "assets/images/products/hoodie/womens-relaxed-fit-fleece-hoodie.jpg",
    galleryImages: [
      "assets/images/products/hoodie/womens-relaxed-fit-fleece-hoodie.jpg",
      "assets/images/products/hoodie/womens-oversized-beige-hoodie.jpg"
    ],
    isNewArrival: true,
    isTopSelling: false
  }
];

// Current active products (defaults to catalog, updated by API)
let PRODUCTS = [...DEFAULT_PRODUCTS];

// Shared INR price formatter
function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price || 0);
}

// Ensure critical shared helpers are safely accessible across classic script files
if (typeof window !== 'undefined') {
  window.formatPrice = formatPrice;
  window.PRODUCTS = PRODUCTS;
  window.DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;
}

// Helper to generate Star Rating HTML
function renderStarRating(rating) {
  const safeRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.4;
  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  }
  if (hasHalfStar) {
    starsHtml += `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4zM22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24z"/></svg>`;
  }
  const remaining = Math.max(0, 5 - Math.ceil(safeRating));
  for (let i = 0; i < remaining; i++) {
    starsHtml += `<svg width="18" height="18" viewBox="0 0 24 24" fill="#E0E0E0"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  }
  return starsHtml;
}

// Generate reusable Product Card HTML
function createProductCardHTML(product) {
  if (!product) return '';
  const discountHtml = product.originalPrice && product.discountPercent
    ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>
       <span class="discount-badge">-${product.discountPercent}%</span>`
    : '';

  const ratingVal = typeof product.rating === 'number' ? product.rating : 0;
  const imageSrc = product.image || 'assets/images/products/tshirt_tape.jpg';

  return `
    <a href="product.html?id=${encodeURIComponent(product.id)}" class="product-card" id="card-${product.id}">
      <div class="product-card-img-wrapper">
        <img src="${imageSrc}" alt="${product.name || 'Product'}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/products/tshirt_tape.jpg';" />
      </div>
      <h4 class="product-card-name">${product.name || 'Untitled Product'}</h4>
      <div class="product-card-rating">
        <div class="stars-container">${renderStarRating(ratingVal)}</div>
        <div class="rating-score">${ratingVal.toFixed(1)}<span>/5</span></div>
      </div>
      <div class="product-card-pricing">
        <span class="current-price">${formatPrice(product.price)}</span>
        ${discountHtml}
      </div>
    </a>
  `;
}

// Backend API Configuration (reads from global config if available, fallback to localhost)
const API_BASE_URL = (typeof window !== 'undefined' && window.TRENDORA_API && window.TRENDORA_API.BASE_URL)
  ? window.TRENDORA_API.BASE_URL
  : 'http://localhost:5000/api';

/**
 * Maps a product from MongoDB / Express backend to match the frontend schema
 */
function mapBackendProduct(bp) {
  if (!bp) return null;
  const id = bp.productId || bp._id || bp.id;
  const colors = Array.isArray(bp.colors) && bp.colors.length > 0
    ? bp.colors
    : ["#000000", "#2B3A42", "#4F4F4F"];
  const sizes = Array.isArray(bp.sizes) && bp.sizes.length > 0
    ? bp.sizes
    : ["Small", "Medium", "Large", "X-Large"];
  const image = bp.image || "assets/images/products/tshirt_tape.jpg";
  const galleryImages = Array.isArray(bp.galleryImages) && bp.galleryImages.length > 0
    ? bp.galleryImages
    : [image];

  return {
    id: String(id),
    mongoId: bp._id ? String(bp._id) : null,
    productId: bp.productId || null,
    name: bp.name || 'Product',
    category: bp.category || 'Casual',
    dressStyle: bp.dressStyle || 'Casual',
    gender: bp.gender || 'Unisex',
    description: bp.description || 'Quality product from Trendora.',
    price: Number(bp.price) || 0,
    originalPrice: bp.originalPrice ? Number(bp.originalPrice) : null,
    discountPercent: bp.discountPercent ? Number(bp.discountPercent) : null,
    rating: typeof bp.rating === 'number' ? bp.rating : 4.5,
    reviewCount: typeof bp.reviewCount === 'number' ? bp.reviewCount : 0,
    colors,
    sizes,
    image,
    galleryImages,
    isNewArrival: Boolean(bp.isNewArrival),
    isTopSelling: Boolean(bp.isTopSelling)
  };
}

/**
 * Merges backend products into the frontend PRODUCTS array.
 * Backend products take precedence; remaining fallback items ensure the full catalog remains intact.
 */
function integrateBackendProducts(backendList) {
  if (!Array.isArray(backendList) || backendList.length === 0) {
    return PRODUCTS;
  }

  const mappedBackend = backendList.map(mapBackendProduct).filter(Boolean);
  const backendIdSet = new Set();
  mappedBackend.forEach(p => {
    backendIdSet.add(p.id);
    if (p.productId) backendIdSet.add(p.productId);
    if (p.mongoId) backendIdSet.add(p.mongoId);
  });

  // Keep fallback products that are not replaced by backend products
  const remainingFallbacks = DEFAULT_PRODUCTS.filter(
    fp => !backendIdSet.has(fp.id)
  );

  PRODUCTS = [...mappedBackend, ...remainingFallbacks];
  return PRODUCTS;
}

/**
 * Fetches products from the backend API with timeout and graceful fallback
 */
async function fetchProductsFromAPI(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);

    const url = `${API_BASE_URL}/products${query.toString() ? '?' + query.toString() : ''}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }

    const data = await res.json();
    if (data && Array.isArray(data.products)) {
      integrateBackendProducts(data.products);
      return { success: true, products: PRODUCTS, source: 'api' };
    }
    throw new Error('Unexpected API response structure');
  } catch (err) {
    console.warn('Backend API unavailable or error occurred, using fallback catalog:', err.message);
    return { success: false, products: PRODUCTS, error: err.message, source: 'fallback' };
  }
}

/**
 * Fetches a single product by ID (supports _id or productId) with fallback
 */
async function fetchProductByIdFromAPI(id) {
  if (!id) return null;
  // First check in-memory catalog
  let found = PRODUCTS.find(p => p.id === id || p.productId === id || p.mongoId === id);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.product) {
        const mapped = mapBackendProduct(data.product);
        // Update in PRODUCTS list if exists, else prepend
        const existingIdx = PRODUCTS.findIndex(p => p.id === mapped.id);
        if (existingIdx > -1) {
          PRODUCTS[existingIdx] = mapped;
        } else {
          PRODUCTS.unshift(mapped);
        }
        return mapped;
      }
    }
  } catch (e) {
    console.warn(`Could not fetch product ${id} from API, using catalog fallback:`, e.message);
  }

  return found || DEFAULT_PRODUCTS.find(p => p.id === id) || DEFAULT_PRODUCTS[0];
}

// Reusable Skeleton Loader generator for product grids
function renderProductSkeletons(count = 4) {
  return Array.from({ length: count }).map(() => `
    <div class="product-card skeleton-loading" style="opacity: 0.7; pointer-events: none;">
      <div class="product-card-img-wrapper" style="background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: skeleton-pulse 1.5s infinite;"></div>
      <div style="height: 18px; width: 70%; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px;"></div>
      <div style="height: 14px; width: 40%; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px;"></div>
      <div style="height: 22px; width: 50%; background: #e0e0e0; border-radius: 4px;"></div>
    </div>
  `).join('');
}

// Ensure all shared product rendering & API functions are safely exposed on window
if (typeof window !== 'undefined') {
  window.renderStarRating = renderStarRating;
  window.createProductCardHTML = createProductCardHTML;
  window.mapBackendProduct = mapBackendProduct;
  window.integrateBackendProducts = integrateBackendProducts;
  window.fetchProductsFromAPI = fetchProductsFromAPI;
  window.fetchProductByIdFromAPI = fetchProductByIdFromAPI;
  window.renderProductSkeletons = renderProductSkeletons;
}
