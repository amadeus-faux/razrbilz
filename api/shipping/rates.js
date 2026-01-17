export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { origin_area_id, destination_area_id, items } = req.body;

    if (!origin_area_id || !destination_area_id || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const response = await fetch('https://api.biteship.com/v1/rates/couriers', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.BITESHIP_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin_area_id,
                destination_area_id,
                couriers: "jne,jnt,sicepat,rayspeed,dhl", // Request all relevant couriers, filter later
                items
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch rates from Biteship');
        }

        // Filter Logic
        let pricing = data.pricing || [];

        // Determine if destination is Indonesia (usually check area info, but simplified logic here based on successful couriers)
        // A more robust way is to check the country of the destination_area_id if available, but Biteship rates response contains courier info.
        // We can infer domestic vs international by the available couriers or by querying area details separately.
        // However, the prompt says: "Jika destination = Indonesia: Tampilkan JNE, J&T, SiCepat. Jika destination = Luar Negeri: Tampilkan Rayspeed, DHL."

        // We will simple filter the list.
        const domesticCouriers = ['jne', 'jnt', 'sicepat'];
        const internationalCouriers = ['rayspeed', 'dhl'];

        // Heuristic: If we have domestic results, assume domestic. If only international, assume international.
        // Or better: Checking the country code from the frontend passed area would be ideal, but we only have ID here.
        // Let's rely on the result set. 

        const domesticResults = pricing.filter(p => domesticCouriers.includes(p.courier_code));
        const internationalResults = pricing.filter(p => internationalCouriers.includes(p.courier_code));

        let finalResults = [];

        // If we have domestic couriers, it's likely a domestic shipment.
        if (domesticResults.length > 0) {
            finalResults = domesticResults;
        } else {
            // Otherwise, show international (or if mixed, show both? Prompt implies strict separation)
            // If domestic is empty, it might be an international shipment
            finalResults = internationalResults;
        }

        // Sort by price
        finalResults.sort((a, b) => a.price - b.price);

        res.status(200).json({
            success: true,
            pricing: finalResults
        });

    } catch (error) {
        console.error('Biteship Rates Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
