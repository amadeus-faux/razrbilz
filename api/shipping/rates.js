export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { origin_area_id, destination_area_id, items } = req.body;

    if (!origin_area_id || !destination_area_id || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (!process.env.BITESHIP_API_KEY) {
        console.error("BITESHIP_API_KEY is missing");
        return res.status(500).json({ error: 'Server Configuration Error: Missing API Key' });
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
                couriers: "jne,jnt,sicepat,rayspeed,dhl",
                items
            })
        });

        const rawText = await response.text();
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            console.error("Biteship Non-JSON Response:", rawText);
            throw new Error(`Biteship returned non-JSON: ${rawText.substring(0, 100)}...`);
        }

        if (!response.ok) {
            console.error('Biteship API Error Response:', data);
            throw new Error(data.error || `Biteship Error ${response.status}: ${JSON.stringify(data)}`);
        }

        // Filter Logic
        let pricing = data.pricing || [];

        const domesticCouriers = ['jne', 'jnt', 'sicepat'];
        const internationalCouriers = ['rayspeed', 'dhl'];

        // Ensure filtering exists
        const domesticResults = pricing.filter(p => domesticCouriers.includes(p.courier_code));
        const internationalResults = pricing.filter(p => internationalCouriers.includes(p.courier_code));
        let finalResults = [];

        if (domesticResults.length > 0) {
            finalResults = domesticResults;
        } else {
            finalResults = internationalResults;
        }

        // Sort by price
        finalResults.sort((a, b) => a.price - b.price);

        res.status(200).json({
            success: true,
            pricing: finalResults
        });

    } catch (error) {
        console.error('Biteship Rates Logic Error:', error);
        res.status(500).json({ error: `Server Error: ${error.message}` });
    }
}
