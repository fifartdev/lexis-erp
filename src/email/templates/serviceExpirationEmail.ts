interface ExpirationEmailParams {
  serviceName: string
  clientName: string
  daysLeft: number
  expirationDate: string
}

export function buildServiceExpirationEmail({
  serviceName,
  clientName,
  daysLeft,
  expirationDate,
}: ExpirationEmailParams): string {
  const dayLabel = daysLeft === 1 ? 'ημέρα' : 'ημέρες'
  const urgencyColor = daysLeft <= 3 ? '#dc2626' : daysLeft <= 14 ? '#d97706' : '#2563eb'
  const urgencyBg = daysLeft <= 3 ? '#fef2f2' : daysLeft <= 14 ? '#fffbeb' : '#eff6ff'

  const formattedDate = new Date(expirationDate).toLocaleDateString('el-GR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return `
<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ειδοποίηση Λήξης Υπηρεσίας</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1e40af;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Lexis Agency ERP</h1>
              <p style="margin:4px 0 0;color:#bfdbfe;font-size:14px;">Ειδοποίηση Λήξης Υπηρεσίας</p>
            </td>
          </tr>
          <!-- Urgency banner -->
          <tr>
            <td style="background-color:${urgencyBg};padding:16px 40px;border-left:4px solid ${urgencyColor};">
              <p style="margin:0;color:${urgencyColor};font-size:15px;font-weight:600;">
                ⚠️ Η υπηρεσία σας λήγει σε <strong>${daysLeft} ${dayLabel}</strong>
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;color:#374151;font-size:15px;">
                Αγαπητέ/ή <strong>${clientName}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;">
                Σας ενημερώνουμε ότι η παρακάτω υπηρεσία σας πλησιάζει στην ημερομηνία λήξης της.
              </p>
              <!-- Service card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Υπηρεσία</p>
                    <p style="margin:0 0 16px;color:#111827;font-size:17px;font-weight:700;">${serviceName}</p>
                    <p style="margin:0 0 4px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Ημερομηνία Λήξης</p>
                    <p style="margin:0;color:${urgencyColor};font-size:15px;font-weight:600;">${formattedDate}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;">
                Για οποιαδήποτε ερώτηση ή ανανέωση της υπηρεσίας, παρακαλούμε επικοινωνήστε μαζί μας.
              </p>
              <p style="margin:0;color:#374151;font-size:15px;">
                Με εκτίμηση,<br />
                <strong>Lexis Agency</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9;padding:20px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                Αυτό το email στάλθηκε αυτόματα από το σύστημα Lexis Agency ERP.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
