
import React, { forwardRef, useImperativeHandle, useRef, } from "react";
import "./Pquotation.css";

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0.00";
  }
  return Number(value).toLocaleString("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const PQuotation = forwardRef(({ data }, ref) => {
  const quotationRef = useRef(null);

  const handleDownload = async () => {
    const element = quotationRef.current;
    const quotationNo = data?.quotationNo || "Quotation";
    const { default: html2pdf } = await import("html2pdf.js");

    const options = {
      margin: 0,
      filename: `Quotation-${quotationNo}.pdf`,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
        avoid: [
          ".main-item-row",
          ".item-detail-row",
          ".summary-section",
          ".notes-section",
          ".quotation-footer",
        ],
      },
    };
    await html2pdf().set(options).from(element).save();
  };

  useImperativeHandle(ref, () => ({
    handleDownload,
  }));

  return (
    <div className="quotation-wrapper">
      <div
        ref={quotationRef}
        className="quotation-page"
      >
        <header className="quotation-header">
          <div className="company-section">
            {data?.company?.logo && (
              <img
                src={data.company.logo}
                alt="Company Logo"
                className="company-logo"
                crossOrigin="anonymous"
              />
            )}

            <div className="company-info">
              <h2>{data?.company?.name || "-"}</h2>
              <p>{data?.company?.address || "-"}</p>
              <p>{data?.company?.phone || "-"} {data?.company?.email && ` • ${data.company.email}`}</p>
            </div>
          </div>

          <div className="quotation-heading">
            <div className="quotation-label"> QUOTATION</div>
            <div className="quotation-number"> {data?.quotationNo || "-"}</div>
            <div className="quotation-date">{data?.quotationDate || "-"}</div>
          </div>
        </header>

        <section className="information-grid">
          <div className="info-card">
            <div className="section-label"> BILL TO </div>
            <h3> {data?.customer?.name || "-"}</h3>
            {data?.customer?.attention && (
              <p>Attn: {data.customer.attention} </p>
            )}
            {data?.customer?.addressLine1 && (
              <p> {data.customer.addressLine1} </p>
            )}

            {data?.customer?.addressLine2 && (
              <p>{data.customer.addressLine2}</p>
            )}

            {data?.customer?.postalCode && (
              <p>{data.customer.postalCode}</p>
            )}

            {data?.customer?.country && (
              <p>{data.customer.country}</p>
            )}
          </div>

          <div className="info-card">
            <div className="section-label">PROJECT DETAILS</div>
            <div className="info-row">
              <span>Project Name</span>
              <strong>{data?.projectName || "-"}</strong>
            </div>

            <div className="info-row">
              <span>Project Number</span>
              <strong>{data?.projectNumber || "-"}</strong>
            </div>
            <div className="info-row">
              <span>Payment Terms</span>
              <strong>{data?.paymentTerms || "-"}</strong>
            </div>
          </div>
        </section>

        <section className="items-section">
          <div className="section-title">Project Specifications</div>
          <table className="items-table">
            <thead>
              <tr>
                <th className="col-no">#</th>
                <th className="col-description">Description</th>
                <th className="col-unit">Unit</th>
                <th className="col-price">Price / Unit</th>
                <th className="col-amount">Amount</th>
              </tr>
            </thead>

            <tbody>
              {data?.items?.map((item, index) => (
                <React.Fragment key={item?.id || index}>
                  <tr className="main-item-row">
                    <td className="item-number">{String(index + 1).padStart(2, "0")}</td>
                    <td><div className="item-title">{item?.description || "-"}</div></td>
                    <td className="text-center"> {item?.unit || "-"}</td>
                    <td className="text-right">{formatAmount(item?.pricePerUnit)}</td>
                    <td className="text-right amount">{formatAmount(item?.amount)}</td>
                  </tr>
                  <tr className="item-detail-row">
                    <td />
                    <td colSpan="4">
                      <div className="detail-grid">
                        <div>
                          <span> No. of Version </span>
                          <strong>{item?.numberOfVersion || "-"}</strong>
                        </div>
                        <div>
                          <span> Specifications </span>
                          <strong>{item?.specifications || "-"}</strong>
                        </div>
                        <div>
                          <span> Notes / Comments </span>
                          <strong>{item?.notes || "-"}</strong>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        <section className="summary-section">
          <div className="summary-box">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong> ${formatAmount(data?.subTotal)}</strong>
            </div>

            <div className="summary-row">
              <span>TAX</span>
              <strong>${formatAmount(data?.tax)}</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <strong>${formatAmount(data?.total)}</strong>
            </div>
          </div>
        </section>

        {data?.notes?.length > 0 && (
          <section className="notes-section">
            <div className="section-title"> Notes & Terms</div>
            <ol>
              {data.notes.map((note, index) => (
                <li key={index}>
                  {note}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="thank-you">
          Thank you for your business. We look forward to your confirmation.
        </div>

        <footer className="quotation-footer">
          <div>
            <div className="footer-label">PREPARED BY</div>
            <strong>{data?.preparedBy || "-"}</strong>
            <p>{data?.preparedEmail || "-"}</p>
          </div>

          <div className="confirmation">
            <div className="footer-label">CONFIRMATION</div>
            <strong>{data?.customer?.name || "-"}</strong>
            <p>{data?.customer?.attention || "-"}</p>
          </div>
        </footer>

        <div className="generated-text">
          This document is electronically generated and does not require a signature.
        </div>
      </div>
    </div>
  );
});

export default PQuotation;

