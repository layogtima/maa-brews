const { createApp, ref, computed, reactive, watch } = Vue;

const WHATSAPP_NUMBER = '917977020339';

createApp({
    setup() {
        const categories = [
            { id: 'all', label: 'All', emoji: '' },
            { id: 'fermented', label: 'Fermented Brews', emoji: '🫙' },
            { id: 'summer', label: 'Summer Coolers', emoji: '🧊' },
        ];
        const activeCategory = ref('all');

        const products = [
            {
                id: 1,
                name: 'Kanji',
                nameHi: 'कांजी',
                category: 'fermented',
                description: 'Traditional root ferment with carrots & mustard seeds. A sip of tart calm, sun-brewed on the balcony.',
                size: '300ml',
                price: 100,
                returnPrice: 90,
                image: 'images/maa-brews-kanji-glass-held-by-maa-in-hand.jpeg',
                tag: 'Probiotic',
                emoji: null,
                bgClass: null,
            },
            {
                id: 2,
                name: 'Beet Kwass',
                nameHi: 'बीट क्वास',
                category: 'fermented',
                description: 'Naturally fermented beet elixir with ginger & simple spices. A vibrant blend of patience and roots.',
                size: '350ml',
                price: 120,
                returnPrice: 110,
                image: 'images/maa-brews-banner-vertical-beet-kwass-details.jpeg',
                tag: 'Gut-Positive',
                emoji: null,
                bgClass: null,
            },
            {
                id: 3,
                name: 'Plain Buttermilk',
                nameHi: 'सादा छाछ',
                category: 'summer',
                description: 'Cool, creamy, classic. The way Maa has always made it — freshly churned.',
                size: '300ml',
                price: 50,
                returnPrice: null,
                image: null,
                tag: null,
                emoji: '🥛',
                bgClass: 'bg-burgundy/5',
            },
            {
                id: 4,
                name: 'Masala Chaas',
                nameHi: 'मसाला छाछ',
                category: 'summer',
                description: 'Spiced buttermilk with cumin, coriander, and a pinch of Maa\'s magic.',
                size: '300ml',
                price: 60,
                returnPrice: null,
                image: null,
                tag: 'Spiced',
                emoji: '🌿',
                bgClass: 'bg-burgundy/5',
            },
            {
                id: 5,
                name: 'Sweet Lassi',
                nameHi: 'मीठी लस्सी',
                category: 'summer',
                description: 'Thick, sweet, and made with fresh curd. Pure comfort in every sip.',
                size: '300ml',
                price: 70,
                returnPrice: null,
                image: null,
                tag: null,
                emoji: '🍯',
                bgClass: 'bg-burgundy/5',
            },
            {
                id: 6,
                name: 'Fresh Raw Mango Drink',
                nameHi: 'कच्चा आम पन्ना',
                category: 'summer',
                description: 'Tangy raw mango, refreshing and seasonal. Summer in a glass.',
                size: '300ml',
                price: 70,
                returnPrice: null,
                image: null,
                tag: 'Seasonal',
                emoji: '🥭',
                bgClass: 'bg-burgundy/5',
            },
        ];

        const cart = reactive({});
        const showCart = ref(false);

        watch(showCart, (open) => {
            document.body.style.overflow = open ? 'hidden' : '';
        });

        const filteredProducts = computed(() => {
            if (activeCategory.value === 'all') return products;
            return products.filter(p => p.category === activeCategory.value);
        });

        const cartItems = computed(() =>
            Object.values(cart).filter(i => i.qty > 0)
        );

        const cartCount = computed(() =>
            cartItems.value.reduce((s, i) => s + i.qty, 0)
        );

        const cartTotal = computed(() =>
            cartItems.value.reduce((s, i) => s + i.product.price * i.qty, 0)
        );

        function getQty(id) {
            return cart[id]?.qty || 0;
        }

        function addToCart(product) {
            if (cart[product.id]) {
                cart[product.id].qty++;
            } else {
                cart[product.id] = { product, qty: 1 };
            }
        }

        function decrement(id) {
            if (!cart[id]) return;
            cart[id].qty--;
            if (cart[id].qty <= 0) delete cart[id];
        }

        function orderOnWhatsApp() {
            if (cartItems.value.length === 0) return;

            let msg = `Hi! I'd like to order from Maa Brews:\n\n`;
            cartItems.value.forEach(i => {
                const sub = i.product.price * i.qty;
                msg += `• ${i.qty}× ${i.product.name} (${i.product.size}) — ₹${sub}\n`;
            });
            msg += `\nTotal: ₹${cartTotal.value}\n\nPlease let me know about availability and delivery. Thank you! 🙏`;

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
        }

        return {
            categories, activeCategory,
            products, filteredProducts,
            cart, showCart,
            cartItems, cartCount, cartTotal,
            getQty, addToCart, decrement,
            orderOnWhatsApp,
        };
    },
}).mount('#app');
