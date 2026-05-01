module.exports = getReverseGeocodeRoute = {
  method: "get",
  path: "/reverse-geocode",
  handler: async (req, res) => {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: "lat and lng are required" });
      }
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "User-Agent": "GreatFood/1.0" } }
      );
      
      if (!response.ok) {
        throw new Error(`Nominatim API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Reverse geocode proxy error:", error);
      res.status(500).json({ error: "Failed to reverse geocode" });
    }
  },
};
