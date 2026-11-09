// ============================================================================
// TalentMatch AI - Live Multi-User WebSocket Synchronization Client
// Connects to ws://localhost:5000/ws with automatic reconnection & event bus
// ============================================================================

class TalentMatchWebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.statusListeners = new Set();
    this.eventListeners = new Set();
    this.reconnectTimeout = null;
    this.reconnectInterval = 3000;
    this.pingInterval = null;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const host = window.location.hostname || "localhost";
      const wsUrl = `ws://${host}:5000/ws`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.notifyStatus(true);
        console.log("[TalentMatch LiveSync] Connected to WebSocket multi-user hub at", wsUrl);

        // Setup 30s heartbeat ping
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "PING" }));
          }
        }, 30000);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "PONG") return; // Heartbeat pong
          this.notifyEvent(data);
        } catch (err) {
          console.warn("[TalentMatch LiveSync] Failed to parse message:", err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.notifyStatus(false);
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn("[TalentMatch LiveSync] Connection error:", err.message || "standby");
        this.isConnected = false;
        this.notifyStatus(false);
      };
    } catch (e) {
      console.warn("[TalentMatch LiveSync] Failed to initialize WebSocket:", e);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback(this.isConnected);
    return () => this.statusListeners.delete(callback);
  }

  onEvent(callback) {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  notifyStatus(status) {
    this.statusListeners.forEach((fn) => {
      try {
        fn(status);
      } catch (e) {
        console.error(e);
      }
    });
  }

  notifyEvent(eventData) {
    this.eventListeners.forEach((fn) => {
      try {
        fn(eventData);
      } catch (e) {
        console.error(e);
      }
    });
  }

  broadcast(actionType, payload = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: "BROADCAST_ACTION",
        actionType,
        payload
      }));
    } else {
      // Fallback via HTTP broadcast
      try {
        fetch("http://localhost:5000/api/sync/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: actionType, payload })
        }).catch(() => {});
      } catch {}
    }
  }
}

export const liveSync = new TalentMatchWebSocketService();
