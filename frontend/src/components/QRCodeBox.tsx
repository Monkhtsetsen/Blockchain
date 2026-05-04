import { QRCodeCanvas } from "qrcode.react";

type Props = {
  value: string;
  label?: string;
  fileName?: string;
  displayText?: string;
};

export default function QRCodeBox({
  value,
  label = "QR Code",
  fileName = "product-qr",
  displayText,
}: Props) {
  const qrId = `qr-${fileName}`;

  const downloadQR = () => {
    const canvas = document.getElementById(qrId) as HTMLCanvasElement | null;

    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${fileName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="qr-box">
      <div className="qr-image">
        <QRCodeCanvas
          id={qrId}
          value={value}
          size={180}
          level="H"
          includeMargin
        />
      </div>

      <div>
        <small>{label}</small>
        <strong>{displayText || value}</strong>

        <p className="qr-url">{value}</p>

        <button className="btn btn-outline qr-btn" onClick={downloadQR}>
          Download QR
        </button>
      </div>
    </div>
  );
}