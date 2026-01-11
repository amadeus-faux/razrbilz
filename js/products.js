// ============================================
// PRODUCT DATABASE WITH LIVE INVENTORY
// ============================================

const products = [
    {
        id: 1,
        code: 'RONIN BALLISTIC TEE',
        name: 'RONIN BALLISTIC TEE',
        price: 999999999,
        stock: 45,
        variants: {
            'S': '47989924790424', 
            'M': '47989924823192',
            'L': '47989924757656',
            'XL': '47989924855960',
            '2XL': '47989924888728'
        },
        image: 'assets/products/product1.png',
        imageDetail: 'assets/products/product1-detail.png',
        gallery: ['assets/products/product1-1.png', 'assets/products/product1-2.png', 'assets/products/product1-3.png'],
        manifesto: 'Steel wrapped in cotton. Built for those who refuse to blend. This is not fashion. This is survival gear for the urban void.',
        specs: {
            material: '16s Premium Cotton Combed (Acid Wash)',
            weight: 'Heavyweight',
            fit: 'Boxy / Drop Shoulder',
            features: 'Triple-tiered sleeves, Metal Rivets'
        },
        sizeRef: 'SUBJECT REFERENCE: Height 178cm / Weight 70kg wears Size L',
        sizeChart: {
            headers: ['SIZE', 'CHEST', 'LENGTH'],
            rows: [
                ['S', '57 cm', '61 cm'],
                ['M', '59 cm', '63 cm'],
                ['L', '62 cm', '65 cm'],
                ['XL', '65 cm', '68 cm'],
                ['2XL', '68 cm', '71 cm']
            ]
        }
    },
    {
        id: 2,
        code: 'AZRAEL HOODIE',
        name: 'AZRAEL HOODIE',
        price: 999999999,
        stock: 45,
        variants: {
            'S': '47989839036568', 
            'M': '47989839069336',
            'L': '47989839102104',
            'XL': '47989839134872',
            '2XL': '47989839167640'
        },
        image: 'assets/products/product2.png',
        imageDetail: 'assets/products/product2-detail.png',
        gallery: ['assets/products/product2-1.png', 'assets/products/product2-2.png', 'assets/products/product2-3.png', 'assets/products/product2-4.png', 'assets/products/product2-5.png', 'assets/products/product2-6.png'],
        manifesto: 'Taking its name from The Reaper, this piece is a homage to shadow and structure. Built with heavyweight materials to forge a silhouette that is solid, imposing, and intimidating.',
        specs: {
            material: 'AeroCool Cotton Fleece 375gsm',
            weight: 'Heavyweight',
            fit: 'Boxy / Drop Shoulder',
            features: 'Tactical pockets, Reflective strips, Water-resistant'
        },
        sizeRef: 'SUBJECT REFERENCE: Height 175cm / Weight 68kg wears Size L',
        sizeChart: {
            headers: ['SIZE', 'CHEST', 'LENGTH'],
            rows: [
                ['S', '57 cm', '61 cm'],
                ['M', '59 cm', '63 cm'],
                ['L', '62 cm', '65 cm'],
                ['XL', '65 cm', '68 cm'],
                ['2XL', '68 cm', '71 cm']
            ]
        }
    },
    {
        id: 3,
        code: 'STRATA LAYERED TEE',
        name: 'STRATA LAYERED TEE',
        price: 999999999,
        stock: 45,
        variants: {
            'S': '47989921480856', 
            'M': '47989921513624',
            'L': '47989921546392',
            'XL': '47989921579160',
            '2XL': '47989921611928'
        },
        image: 'assets/products/product3.png',
        imageDetail: 'assets/products/product3-detail.png',
        gallery: ['assets/products/product3-1.png', 'assets/products/product3-2.png', 'assets/products/product3-3.png'],
        manifesto: 'Steel wrapped in cotton. Built for those who refuse to blend. This is not fashion. This is survival gear for the urban void.',
        specs: {
            material: '16s Premium Cotton Combed, AeroCool Cotton Fleece 285gsm',
            weight: 'Heavyweight',
            fit: 'Oversize',
            features: 'Double layered sleeves, Metal Rivets'
        },
        sizeRef: 'SUBJECT REFERENCE: Height 165cm / Weight 59kg wears Size S',
        sizeChart: {
            headers: ['SIZE', 'CHEST', 'LENGTH'],
            rows: [
                ['S', '57 cm', '61 cm'],
                ['M', '59 cm', '63 cm'],
                ['L', '62 cm', '65 cm'],
                ['XL', '65 cm', '68 cm'],
                ['2XL', '68 cm', '71 cm']
            ]
        }
    }
];

// Load inventory from localStorage
function loadInventory() {
    const savedInventory = localStorage.getItem('razrbilz_inventory');
    if (savedInventory) {
        const inventory = JSON.parse(savedInventory);
        products.forEach(product => {
            const saved = inventory.find(item => item.id === product.id);
            if (saved) {
                product.stock = saved.stock;
            }
        });
    } else {
        // Initialize inventory in localStorage
        saveInventory();
    }
}

// Save inventory to localStorage
function saveInventory() {
    const inventory = products.map(p => ({
        id: p.id,
        stock: p.stock
    }));
    localStorage.setItem('razrbilz_inventory', JSON.stringify(inventory));
}

// Get stock status based on quantity
function getStockStatus(quantity) {
    if (quantity === 0) {
        return { status: 'SOLD OUT', class: 'stock-sold-out' };
    } else if (quantity >= 1 && quantity <= 10) {
        return { status: 'LOW', class: 'stock-low' };
    } else if (quantity >= 11 && quantity <= 25) {
        return { status: 'CRITICAL', class: 'stock-critical' };
    } else {
        return { status: 'AVAILABLE', class: 'stock-available' };
    }
}

// Decrement stock after successful purchase
function decrementStock(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        product.stock -= quantity;
        if (product.stock < 0) product.stock = 0;
        saveInventory();
        return true;
    }
    return false;
}

// Initialize inventory on load
loadInventory();
