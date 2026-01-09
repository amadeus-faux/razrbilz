// ============================================
// PRODUCT DATABASE WITH LIVE INVENTORY
// ============================================

const products = [
    {
        id: 1,
        code: 'RONIN_BALLISTIC_001',
        name: 'THE RONIN BALLISTIC TEE',
        price: 245000,
        stock: 0,
        image: 'assets/products/product1.jpg',
        imageDetail: 'assets/products/product1-detail.jpg',
        gallery: ['assets/products/product1-1.jpg', 'assets/products/product1-2.jpg', 'assets/products/product1-3.jpg'],
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
        code: 'RECON_002',
        name: 'THE RECON HOODIE',
        price: 410000,
        stock: 8,
        image: 'assets/products/product2.png',
        imageDetail: 'assets/products/product2-detail.png',
        gallery: ['assets/products/product2-1.png', 'assets/products/product2-2.png', 'assets/products/product2-3.png'],
        manifesto: 'Engineered for chaos. Tactical pockets hold your essentials while you navigate the concrete city. Soul-resistant.',
        specs: {
            material: 'AeroCool Cotton Fleece 375gsm',
            weight: 'Heavyweight',
            fit: 'Boxy / Drop Shoulder',
            features: 'Tactical pockets, Reflective strips, Water-resistant'
        },
        sizeRef: 'SUBJECT REFERENCE: Height 175cm / Weight 68kg wears Size M',
        sizeChart: {
            headers: ['SIZE', 'CHEST', 'LENGTH'],
            rows: [
                ['S', '57 cm', '61 cm'],
                ['M', '59 cm', '63 cm'],
                ['L', '62 cm', '65 cm'],
                ['XL', '65 cm', '68 cm'],
                ['2XL', '68 cm', '71 cm']
            ]
        },
        variants: {
            'S': '47989839036568', 
            'M': '47989839069336',
            'L': '47989839102104',
            'XL': '47989839134872',
            '2XL': '47989839167640'
        }
    },
    {
        id: 3,
        code: 'STRATA_LAYERED_003',
        name: 'THE STRATA LAYERED TEE',
        price: 245000,
        stock: 23,
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
