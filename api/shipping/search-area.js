export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { query } = req.query;

    if (!query || query.length < 3) {
        return res.status(400).json({ error: 'Query parameter required (min 3 chars)' });
    }

    try {
        const response = await fetch(`https://api.biteship.com/v1/maps/areas?input=${encodeURIComponent(query)}&type=single`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.BITESHIP_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch areas from Biteship');
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Biteship Search Area Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
