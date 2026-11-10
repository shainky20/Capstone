import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";

export default function RouteOptimizer() {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    let intervalId;
    let script;

    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
        center: { lat: 23.5, lng: 77.5 },
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#e8f4fd" }],
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#475569" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#bfdbfe" }],
          },
        ],
      });

      // Traffic layer
      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(map);

      // Markers
      new window.google.maps.Marker({
        position: { lat: 19.076, lng: 72.8777 },
        map,
        title: "Mumbai",
      });

      new window.google.maps.Marker({
        position: { lat: 23.0225, lng: 72.5714 },
        map,
        title: "Ahmedabad",
      });

      new window.google.maps.Marker({
        position: { lat: 28.6139, lng: 77.209 },
        map,
        title: "Delhi",
      });

      // CURRENT ROUTE (red)
      const currentRoute = new window.google.maps.Polyline({
        path: [
          { lat: 19.076, lng: 72.8777 },
          { lat: 28.6139, lng: 77.209 },
        ],
        geodesic: true,
        strokeColor: "#ef4444",
        strokeOpacity: 1,
        strokeWeight: 5,
      });

      currentRoute.setMap(map);

      // OPTIMIZED ROUTE (blue)
      const optimizedRoute = new window.google.maps.Polyline({
        path: [
          { lat: 19.076, lng: 72.8777 },
          { lat: 23.0225, lng: 72.5714 },
          { lat: 28.6139, lng: 77.209 },
        ],
        geodesic: true,
        strokeColor: "#0ea5e9",
        strokeOpacity: 1,
        strokeWeight: 6,
      });

      optimizedRoute.setMap(map);

      // Moving shipment dot
      const shipmentPath = [
        { lat: 19.076, lng: 72.8777 },
        { lat: 23.0225, lng: 72.5714 },
        { lat: 28.6139, lng: 77.209 },
      ];

      let i = 0;

      const shipment = new window.google.maps.Marker({
        position: shipmentPath[0],
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        },
      });

      intervalId = window.setInterval(() => {
        i = (i + 1) % shipmentPath.length;
        shipment.setPosition(shipmentPath[i]);
      }, 1400);
    };

    if (window.google) {
      initMap();
    } else {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setMapError("Set VITE_GOOGLE_MAPS_API_KEY to enable the map.");
        return undefined;
      }

      script = document.createElement("script");

      script.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        encodeURIComponent(apiKey);

      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        setMapError("Google Maps could not be loaded. Check the browser key and its restrictions.");
      };

      document.body.appendChild(script);
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      if (script) script.remove();
    };
  }, []);

  const card = {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "22px",
    color: "#1e293b",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(37,99,235,.08)",
  };

  return (
    <Layout>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* MAP */}
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>🌍 AI Route Optimizer</h2>

          <div
            ref={mapRef}
            style={{
              height: "560px",
              width: "100%",
              marginTop: "16px",
              borderRadius: "18px",
              overflow: "hidden",
            }}
          />
          {mapError && (
            <p role="alert" style={{ color: "#b91c1c", marginBottom: 0 }}>
              {mapError}
            </p>
          )}
        </div>

        {/* SIDE PANEL */}
        <div style={{ display: "grid", gap: "20px" }}>
          <div style={card}>
            <h3>Current Route</h3>
            <p>Mumbai → Delhi</p>
            <p>ETA: 18 hrs</p>
            <p style={{ color: "#ef4444" }}>Risk: High</p>
          </div>

          <div style={card}>
            <h3>Optimized Route</h3>
            <p>Mumbai → Ahmedabad → Delhi</p>
            <p>ETA: 14 hrs</p>
            <p style={{ color: "#22c55e" }}>Risk: Low</p>
          </div>

          <div style={card}>
            <h3>Savings</h3>
            <p>⏱ 4 Hours Saved</p>
            <p>💰 ₹82,000 Reduced Cost</p>
            <p>⚡ 92% Confidence</p>
          </div>

          <div style={card}>
            <h3>Live Insights</h3>
            <p>🌧 Heavy rain near Mumbai</p>
            <p>🚗 Traffic on NH48</p>
            <p>☀ Ahmedabad corridor safer</p>
          </div>

          <button
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(90deg,#0ea5e9,#1d4ed8)",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Optimize All Routes
          </button>
        </div>
      </div>
    </Layout>
  );
}