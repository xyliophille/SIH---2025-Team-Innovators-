import qrcode
import json

session_data = {
    "session_id": "20250909_CSIT202",
    "course_id": "CSIT202",
    "faculty_id": "F001",
    "date": "2025-09-09"
    
}
url = f"http://10.130.1.116/index.html?serverWindowId=073444ab-fb9e-4ba3-8abe-a14bd6f0ccd5"

session_json = json.dumps(session_data)

qr = qrcode.make(url)

filename = "mobile4_qr.png"
qr.save(filename)

print(f"QR Code generated and saved as {filename}")
