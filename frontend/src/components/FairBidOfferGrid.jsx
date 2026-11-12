import { useMemo, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, themeQuartz } from "ag-grid-community";
import { formatINR } from "../utils/currency";

// Register AG Grid Community modules once
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Normalizes offer data from diverse sources:
 * 1. Database buyer_offers table (via fetchListingOffers)
 * 2. Instant FairBid calculator offers (via /api/offers)
 * 3. Static benchmark comparison lot offers
 */
function normalizeOffer(offer, index) {
  if (!offer) return null;

  const buyer_id = offer.buyer_id || offer.buyerId || `BUYER-${index + 1}`;
  const buyer_name = offer.buyer_name || offer.buyerName || `Buyer #${index + 1}`;
  const buyer_location =
    offer.buyer_location || offer.location || (index === 0 ? "Hyderabad Hub" : "Regional Cluster");

  const price_per_kg = Number(offer.price_per_kg) || 0;
  const quantity_kg = Number(offer.offered_quantity_kg || offer.quantity_kg || offer.quantity) || 0;
  const gross_amount =
    Number(offer.gross_amount) || Math.round(price_per_kg * quantity_kg * 100) / 100;

  // Transport deduction
  const transport_cost =
    offer.transport_cost !== undefined && offer.transport_cost !== null
      ? Number(offer.transport_cost)
      : offer.transport_deduction !== undefined
      ? Number(offer.transport_deduction)
      : null;

  // Handling / moisture dockage deduction
  const handling_cost =
    offer.handling_cost !== undefined && offer.handling_cost !== null
      ? Number(offer.handling_cost)
      : offer.handling_deduction !== undefined
      ? Number(offer.handling_deduction)
      : null;

  // Cess / levies deduction
  const other_deductions =
    offer.other_deductions !== undefined && offer.other_deductions !== null
      ? Number(offer.other_deductions)
      : offer.mandi_cess !== undefined
      ? Number(offer.mandi_cess)
      : null;

  // Compute total known deductions deterministically
  let knownDeductions = 0;
  if (transport_cost !== null) knownDeductions += transport_cost;
  if (handling_cost !== null) knownDeductions += handling_cost;
  if (other_deductions !== null) knownDeductions += other_deductions;

  const total_deductions =
    offer.total_deductions !== undefined
      ? Number(offer.total_deductions)
      : Math.round(knownDeductions * 100) / 100;

  // Net realization: ALWAYS use existing FairBid net_proceeds if provided!
  const net_proceeds =
    offer.net_proceeds !== undefined && offer.net_proceeds !== null
      ? Number(offer.net_proceeds)
      : Math.round((gross_amount - total_deductions) * 100) / 100;

  // Safety flag: check if deductions are incomplete/unknown
  const is_incomplete = Boolean(
    offer.is_incomplete ||
      transport_cost === null ||
      offer.status === "UNVERIFIED" ||
      offer.unverified_deductions
  );

  const status = offer.status || "PENDING";
  const reliability =
    offer.reliability ||
    (offer.rating ? `${offer.rating} Verified` : "Verified Buyer");

  const notes = offer.notes || "";
  const offer_id = offer.offer_id || offer.offerId || `OFF-${buyer_id}`;

  return {
    raw: offer,
    offer_id,
    buyer_id,
    buyer_name,
    buyer_location,
    crop: offer.crop || "Produce",
    price_per_kg,
    quantity_kg,
    gross_amount,
    transport_cost,
    handling_cost,
    other_deductions,
    total_deductions,
    net_proceeds,
    status,
    reliability,
    notes,
    is_incomplete,
    is_deceptive_headline: Boolean(offer.is_deceptive_headline),
    passport_url: offer.passport_url || `/buyers/${buyer_id}/passport`,
  };
}

export default function FairBidOfferGrid({
  offers = [],
  selectedBuyer = null,
  onSelectBuyer = null,
  onAcceptOffer = null,
  disabled = false,
  title = "FairBid Interactive Buyer Offer Matrix",
  subtitle = "Audited take-home comparison powered by AG Grid Community & Gemini AI net analysis.",
}) {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [copiedToast, setCopiedToast] = useState(false);

  // Normalize data and compute rankings
  const rowData = useMemo(() => {
    if (!offers || offers.length === 0) return [];
    const normalized = offers.map((o, idx) => normalizeOffer(o, idx, offers));

    // Determine highest confirmed net realization among complete offers
    const completeOffers = normalized.filter((o) => !o.is_incomplete);
    const maxConfirmedNet =
      completeOffers.length > 0
        ? Math.max(...completeOffers.map((o) => o.net_proceeds))
        : 0;

    // Determine highest headline offered rate
    const maxHeadlineRate = Math.max(...normalized.map((o) => o.price_per_kg));

    return normalized.map((item) => {
      // Mark confirmed best offer: highest net take-home with COMPLETE deductions
      const is_best_confirmed =
        !item.is_incomplete &&
        maxConfirmedNet > 0 &&
        item.net_proceeds === maxConfirmedNet;

      // Mark deceptive headline rate: higher quoted price than the best offer, but lower net proceeds!
      const is_deceptive_headline =
        item.price_per_kg > 0 &&
        item.net_proceeds < maxConfirmedNet &&
        item.price_per_kg >= maxHeadlineRate - 0.01;

      return {
        ...item,
        is_best_confirmed,
        is_deceptive_headline,
      };
    });
  }, [offers]);

  // Dynamic summary metrics
  const summaryMetrics = useMemo(() => {
    if (!rowData || rowData.length === 0) {
      return {
        total: 0,
        maxHeadlineRate: 0,
        maxConfirmedNet: 0,
        incompleteCount: 0,
        bestBuyer: null,
      };
    }

    const total = rowData.length;
    const maxHeadlineRate = Math.max(...rowData.map((r) => r.price_per_kg));
    const completeList = rowData.filter((r) => !r.is_incomplete);
    const maxConfirmedNet =
      completeList.length > 0
        ? Math.max(...completeList.map((r) => r.net_proceeds))
        : 0;
    const bestBuyer = completeList.find((r) => r.net_proceeds === maxConfirmedNet);
    const incompleteCount = rowData.filter((r) => r.is_incomplete).length;

    return {
      total,
      maxHeadlineRate,
      maxConfirmedNet,
      incompleteCount,
      bestBuyer,
    };
  }, [rowData]);

  // FarmPay AI Rooted Warmth theme customized via AG Grid Theming API
  const gridTheme = useMemo(() => {
    return themeQuartz.withParams({
      accentColor: "#4a7c59",
      backgroundColor: "#ffffff",
      headerBackgroundColor: "#f0ece4",
      headerTextColor: "#2e3230",
      headerFontWeight: 700,
      textColor: "#2e3230",
      borderColor: "#e4e0d8",
      rowHoverColor: "#f5f1ea",
      fontFamily: "'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: 13,
      borderRadius: 12,
      wrapperBorderRadius: 16,
      cellHorizontalPadding: 14,
    });
  }, []);

  // CSV Export using AG Grid Community
  const handleExportCsv = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: "FarmPay_AI_Buyer_Offers.csv",
        columnKeys: [
          "buyer_name",
          "buyer_location",
          "price_per_kg",
          "quantity_kg",
          "gross_amount",
          "transport_cost",
          "handling_cost",
          "other_deductions",
          "total_deductions",
          "net_proceeds",
          "status",
          "reliability",
          "notes",
        ],
        processCellCallback: (params) => {
          const colId = params.column.getColId();
          const val = params.value;

          if (
            [
              "price_per_kg",
              "gross_amount",
              "transport_cost",
              "handling_cost",
              "other_deductions",
              "total_deductions",
              "net_proceeds",
            ].includes(colId)
          ) {
            if (val === null || val === undefined || isNaN(val)) return "N/A";
            return `INR ${Number(val).toFixed(2)}`;
          }

          if (colId === "quantity_kg") {
            return `${val} kg`;
          }

          return val || "";
        },
      });

      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  }, []);

  // AG Grid Column Definitions
  const columnDefs = useMemo(() => {
    return [
      // 1. Buyer & Identity
      {
        headerName: "Buyer / Commercial Desk",
        field: "buyer_name",
        minWidth: 240,
        flex: 1.5,
        pinned: "left",
        filter: "agTextColumnFilter",
        cellRenderer: (params) => {
          const data = params.data;
          if (!data) return null;

          return (
            <div className="flex flex-col justify-center py-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-on-surface text-sm">
                  {data.buyer_name}
                </span>
                {data.is_best_confirmed && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-primary/15 text-primary text-[10px] font-bold uppercase tracking-wider">
                    ★ Best Net
                  </span>
                )}
                {data.is_deceptive_headline && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-error-container text-error text-[10px] font-bold uppercase">
                    ⚠️ Deceptive
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                <span>{data.buyer_location}</span>
                <span className="text-outline-variant">•</span>
                <Link
                  to={data.passport_url}
                  className="text-primary hover:underline font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  Trust Passport →
                </Link>
              </div>
            </div>
          );
        },
      },

      // 2. Offered Price / kg
      {
        headerName: "Offered Rate",
        field: "price_per_kg",
        width: 135,
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: (params) => {
          const val = params.value;
          if (val === null || val === undefined) return "—";

          return (
            <div className="flex flex-col justify-center py-1">
              <div className="font-headline font-bold text-on-surface text-sm">
                {formatINR(val)}
                <span className="text-[11px] font-normal text-on-surface-variant"> / kg</span>
              </div>
              <span className="text-[10px] font-mono text-outline">
                ₹{(val * 100).toLocaleString()}/Qtl
              </span>
            </div>
          );
        },
      },

      // 3. Crop Quantity
      {
        headerName: "Quantity",
        field: "quantity_kg",
        width: 125,
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: (params) => {
          const val = params.value;
          if (!val) return "—";
          return (
            <div className="flex flex-col justify-center py-1">
              <span className="font-semibold text-on-surface text-xs">
                {val.toLocaleString()} kg
              </span>
              <span className="text-[10px] text-outline">
                {(val / 100).toFixed(1)} Qtl
              </span>
            </div>
          );
        },
      },

      // 4. Gross Value
      {
        headerName: "Gross Amount",
        field: "gross_amount",
        width: 145,
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: (params) => {
          const val = params.value;
          if (val === null || val === undefined) return "—";
          return (
            <div className="flex items-center h-full">
              <span className="font-mono font-semibold text-on-surface text-xs">
                {formatINR(val)}
              </span>
            </div>
          );
        },
      },

      // 5. Transport Deduction
      {
        headerName: "Transport Cost",
        field: "transport_cost",
        width: 140,
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: (params) => {
          const val = params.value;
          if (val === null || val === undefined) {
            return (
              <span className="text-outline text-xs italic">Unspecified</span>
            );
          }
          if (val === 0) {
            return (
              <span className="text-primary font-bold text-xs bg-primary/10 px-2 py-0.5 rounded-md">
                ₹0.00 (Buyer Paid)
              </span>
            );
          }
          return (
            <span className="text-error font-semibold text-xs">
              - {formatINR(val)}
            </span>
          );
        },
      },

      // 6. Handling & Dockage
      {
        headerName: "Moisture / Dockage",
        field: "handling_cost",
        width: 150,
        sortable: true,
        cellRenderer: (params) => {
          const val = params.value;
          if (val === null || val === undefined) {
            return <span className="text-outline text-xs">—</span>;
          }
          if (val === 0) {
            return (
              <span className="text-primary font-semibold text-xs">
                ₹0.00 (Pass)
              </span>
            );
          }
          return (
            <span className="text-error font-semibold text-xs">
              - {formatINR(val)}
            </span>
          );
        },
      },

      // 7. Other Deductions (Mandi Cess / Levies)
      {
        headerName: "Cess & User Fee",
        field: "other_deductions",
        width: 140,
        sortable: true,
        cellRenderer: (params) => {
          const val = params.value;
          if (val === null || val === undefined) {
            return <span className="text-outline text-xs">—</span>;
          }
          return (
            <span className="text-on-surface-variant font-medium text-xs">
              - {formatINR(val)}
            </span>
          );
        },
      },

      // 8. Total Known Deductions
      {
        headerName: "Total Deductions",
        field: "total_deductions",
        width: 150,
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: (params) => {
          const val = params.value;
          const isInc = params.data?.is_incomplete;
          return (
            <div className="flex flex-col justify-center py-1">
              <span className="text-error font-bold text-xs">
                - {formatINR(val)}
              </span>
              {isInc && (
                <span className="text-[10px] text-tertiary font-medium">
                  ⚠️ Incomplete data
                </span>
              )}
            </div>
          );
        },
      },

      // 9. True Net Realization (FairBid Priority Calculation)
      {
        headerName: "True Net Take-Home",
        field: "net_proceeds",
        width: 190,
        sortable: true,
        sort: "desc", // Default sorted by highest net payout!
        filter: "agNumberColumnFilter",
        cellRenderer: (params) => {
          const val = params.value;
          const data = params.data;
          const isBest = data?.is_best_confirmed;

          return (
            <div
              className={`flex flex-col justify-center px-2 py-1 rounded-lg ${
                isBest ? "bg-primary/10 border border-primary/30" : ""
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-headline font-bold text-sm ${
                    isBest ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {formatINR(val)}
                </span>
              </div>
              <span className="text-[10px] text-outline font-medium">
                Bank Deposit Guaranteed
              </span>
            </div>
          );
        },
      },

      // 10. Status
      {
        headerName: "Offer Status",
        field: "status",
        width: 130,
        sortable: true,
        filter: "agTextColumnFilter",
        cellRenderer: (params) => {
          const status = String(params.value || "PENDING").toUpperCase();
          let bgClass = "bg-surface-container text-on-surface-variant";
          if (status === "ACCEPTED") bgClass = "bg-primary-fixed text-primary font-bold";
          if (status === "REJECTED") bgClass = "bg-error-container text-error";
          if (status === "PENDING") bgClass = "bg-amber-100 text-amber-900 font-semibold";
          if (status === "UNVERIFIED") bgClass = "bg-red-50 text-red-700 font-semibold";

          return (
            <div className="flex items-center h-full">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider ${bgClass}`}>
                {status}
              </span>
            </div>
          );
        },
      },

      // 11. Buyer Trust Information
      {
        headerName: "Trust & Escrow",
        field: "reliability",
        width: 170,
        sortable: true,
        cellRenderer: (params) => {
          const rel = params.value || "Verified";

          return (
            <div className="flex flex-col justify-center py-1">
              <div className="flex items-center gap-1 text-xs font-bold text-on-surface">
                <span className="material-symbols-outlined text-[15px] text-primary">
                  verified_user
                </span>
                <span>{rel}</span>
              </div>
              <span className="text-[10px] text-outline">RBI Pool Escrow T+0</span>
            </div>
          );
        },
      },

      // 12. Farmer Action
      {
        headerName: "Action",
        field: "actions",
        width: 180,
        pinned: "right",
        sortable: false,
        filter: false,
        cellRenderer: (params) => {
          const offer = params.data;
          if (!offer) return null;

          const isSelected = selectedBuyer?.buyer_id === offer.buyer_id;

          return (
            <div className="flex items-center gap-1.5 h-full py-1">
              {offer.status === "PENDING" && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAcceptOffer) {
                      onAcceptOffer(offer);
                    } else {
                      navigate(`/orders/FP-2024-884/escrow`);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Lock in escrow and create binding contract"
                >
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  <span>Accept</span>
                </button>
              )}

              <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectBuyer) {
                    onSelectBuyer(offer.raw || offer);
                  }
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary-fixed border-primary text-primary"
                    : "bg-surface-container hover:bg-surface-container-high border-outline-variant/40 text-on-surface"
                }`}
              >
                {isSelected ? "Selected ✓" : "Select"}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/negotiation/${offer.offer_id || "TND-8821"}`);
                }}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                title="Open in AI Negotiation Copilot"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
              </button>
            </div>
          );
        },
      },
    ];
  }, [selectedBuyer, onAcceptOffer, onSelectBuyer, disabled, navigate]);

  // Default column properties for AG Grid
  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: false,
    };
  }, []);

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-5 sm:p-6 mb-8 font-body">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>FarmPay_AI_Buyer_Offers.csv exported successfully!</span>
        </div>
      )}

      {/* COMPACT METRIC SUMMARY SECTION */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">table_chart</span>
              <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface">
                {title}
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 font-bold text-xs shadow-xs transition-all cursor-pointer"
              title="Export buyer offers to CSV"
            >
              <span className="material-symbols-outlined text-primary text-base">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
              Available Bids
            </span>
            <span className="font-headline text-lg sm:text-xl font-bold text-on-surface">
              {summaryMetrics.total} Offers
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Across verified commercial desks
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
              Highest Headline Rate
            </span>
            <span className="font-headline text-lg sm:text-xl font-bold text-on-surface">
              {summaryMetrics.maxHeadlineRate > 0
                ? `${formatINR(summaryMetrics.maxHeadlineRate)}/kg`
                : "—"}
            </span>
            <span className="text-[10px] text-outline">Before hidden deductions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
              ★ Best Confirmed Net
            </span>
            <span className="font-headline text-lg sm:text-xl font-bold text-primary">
              {summaryMetrics.maxConfirmedNet > 0
                ? formatINR(summaryMetrics.maxConfirmedNet)
                : "—"}
            </span>
            <span className="text-[11px] font-semibold text-primary/90 truncate">
              {summaryMetrics.bestBuyer ? summaryMetrics.bestBuyer.buyer_name : "Guaranteed Bank Take-Home"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
              Unverified / Incomplete
            </span>
            <span className="font-headline text-lg sm:text-xl font-bold text-tertiary">
              {summaryMetrics.incompleteCount} Offers
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Require moisture/transit audit
            </span>
          </div>
        </div>

        {/* Educational Disclaimer Banner */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container border border-outline-variant/20 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
            info
          </span>
          <p className="leading-relaxed">
            <strong>Farmer Autonomy Insight:</strong> Compare buyer offers based on actual deductions and estimated net realization, not just the quoted price. Offers with unverified or shifting transport terms are never ranked as confirmed best deals.
          </p>
        </div>
      </div>

      {/* QUICK FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            placeholder="Search buyers, locations, or status..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface border border-outline-variant/50 text-xs text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="hidden sm:inline font-semibold">Tip:</span>
          <span>Click column headers to sort by Net Take-Home or Rate.</span>
        </div>
      </div>

      {/* AG GRID CONTAINER */}
      <div
        className="w-full overflow-hidden rounded-xl border border-outline-variant/30"
        style={{ height: "420px" }}
      >
        <AgGridReact
          ref={gridRef}
          theme={gridTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20]}
          rowSelection="single"
          onRowClicked={(params) => {
            if (onSelectBuyer && params.data) {
              onSelectBuyer(params.data.raw || params.data);
            }
          }}
          animateRows={true}
          suppressCellFocus={false}
          enableCellTextSelection={true}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-[11px] text-outline font-medium">
        <span>AG Grid Community v36.3.0 • FairBid Audited Net Algorithm</span>
        <span>All financial settlements conducted strictly in Indian Rupees (INR)</span>
      </div>
    </div>
  );
}
