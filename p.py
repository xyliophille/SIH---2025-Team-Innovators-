import qrcode
import json

# Example session data
session_data = {
    "session_id": "20250909_CSIT202",
    "course_id": "CSIT202",
    "faculty_id": "F001",
    "date": "2025-09-09"
}

# Convert dict to JSON string
session_json = json.dumps(session_data)

# Generate QR Code
qr = qrcode.make(session_json)
qr.save("session_qr.png")

print("QR Code generated: session_qr.png")
# The QR code image will be saved as 'session_qr.png'
