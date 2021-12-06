import { useContext, useState } from "react";
import {
  useFlagship,
  IHit,
  HitType,
  IScreen,
  ITransaction,
  IItem,
  IEvent,
  EventCategory,
} from "@flagship.io/react-sdk";
import { appContext } from "../App";
import {
  ERROR_SDK_NOT_READY,
  ERROR_VISITOR_NOT_SET,
} from "../constants/errorMessage";

export default function Hits() {
  const hitTypes: HitType[] = [
    HitType.EVENT,
    HitType.TRANSACTION,
    HitType.ITEM,
    HitType.PAGE,
    HitType.SCREEN,
  ];
  const [hit, setHit] = useState<IHit>({
    type: HitType.EVENT,
    category: EventCategory.ACTION_TRACKING,
    transactionId: "",
    productName: "",
    productSku: "",
  });
  const [hitOk, setHitOk] = useState({ error: "", ok: false });
  const [screenHeight, setScreenHeight] = useState("");
  const [screenWidth, setScreenWidth] = useState("");
  const { appState } = useContext(appContext);

  const fs = useFlagship();

  const HitEventInput = () => {
  
    const event = hit as IEvent;
    return (
      <>
        <div className="form-group">
          <label>Event Category</label>
          <select
            className="form-control"
            value={event.category || ""}
            onChange={(e) =>
              setHit({ ...event, category: e.target.value as EventCategory })
            }
            required
          >
            <option value="">Please Choose an event Category </option>
            <option value="Action Tracking">ACTION_TRACKING</option>
            <option value="User Engagement">USER_ENGAGEMENT</option>
          </select>
        </div>

        <div className="form-group">
          <label>Event Action</label>
          <input
            type="text"
            className="form-control"
            placeholder="Event Action"
            value={event.action || ""}
            onChange={(e) => setHit({ ...event, action: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Value (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Event Value"
            value={event.value || ""}
            onChange={(e) => {
              if (!isNumber(e)) return;
              setHit({ ...event, value: Number(e.target.value) });
            }}
          />
        </div>

        <div className="form-group">
          <label>Event Label (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Event Label"
            value={event.label || ""}
            onChange={(e) => setHit({ ...event, label: e.target.value })}
          />
        </div>
      </>
    );
  };

  const HitItemInput = () => {
    const item = hit as IItem;
    return (
      <>
        <div className="form-group">
          <label>Transaction ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Transaction ID"
            value={item.transactionId || ""}
            onChange={(e) => setHit({ ...item, transactionId: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Item Name"
            value={item.productName || ""}
            onChange={(e) => setHit({ ...item, productName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Item Code</label>
          <input
            type="text"
            className="form-control"
            placeholder="Item Code"
            value={item.productSku || ""}
            onChange={(e) => setHit({ ...item, productSku: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Item Category (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Item Category"
            value={item.itemCategory || ""}
            onChange={(e) => setHit({ ...item, itemCategory: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Item Price (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Item Price"
            value={item.itemPrice || ""}
            onChange={(e) => {
              if (!isNumber(e)) return;
              setHit({ ...item, itemPrice: Number(e.target.value) });
            }}
          />
        </div>

        <div className="form-group">
          <label>Item Quantity (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Item Quantity"
            value={item.itemQuantity || ""}
            onChange={(e) => {
              if (!isNumber(e)) return;
              setHit({ ...item, itemQuantity: Number(e.target.value) });
            }}
          />
        </div>
      </>
    );
  };
  const HitTransactionInput = () => {
    const transaction = hit as ITransaction;
    return (
      <>
        <div className="form-group">
          <label>Transaction ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Transaction ID"
            value={transaction.transactionId || ""}
            onChange={(e) =>
              setHit({ ...transaction, transactionId: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Transaction Affiliation</label>
          <input
            type="text"
            className="form-control"
            placeholder="Transaction Affiliation"
            value={transaction.affiliation || ""}
            onChange={(e) =>
              setHit({ ...transaction, affiliation: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Transaction Revenue (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Transaction Revenue"
            value={transaction.totalRevenue || ""}
            onChange={(e) => {
              if (!isNumber(e)) return;
              setHit({ ...transaction, totalRevenue: Number(e.target.value) });
            }}
          />
        </div>

        <div className="form-group">
          <label>Shipping Cost (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Shipping Cost"
            value={transaction.shippingCosts || ""}
            onChange={(e) => {
              if (!isNumber(e)) return;
              setHit({ ...transaction, shippingCosts: Number(e.target.value) });
            }}
          />
        </div>

        <div className="form-group">
          <label>Shipping Method (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Shipping Method"
            value={transaction.shippingMethod || ""}
            onChange={(e) =>
              setHit({ ...transaction, shippingMethod: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Transaction Taxes (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Transaction Taxes"
            value={transaction.taxes || ""}
            onChange={(e) => {
              if (!isNumber(e)) return;
              setHit({ ...transaction, taxes: Number(e.target.value) });
            }}
          />
        </div>

        <div className="form-group">
          <label>Transaction Currency (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Transaction Currency"
            value={transaction.currency || ""}
            onChange={(e) =>
              setHit({ ...transaction, currency: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Payment Method (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Payment Method"
            value={transaction.paymentMethod || ""}
            onChange={(e) =>
              setHit({ ...transaction, paymentMethod: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Item Count (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Item Count"
            value={transaction.itemCount || ""}
            onChange={(e) => {
              if (!isNumber(e)) return;
              setHit({ ...transaction, itemCount: Number(e.target.value) });
            }}
          />
        </div>
        <div className="form-group">
          <label>Coupon Code (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Coupon Code"
            value={transaction.couponCode || ""}
            onChange={(e) =>
              setHit({ ...transaction, couponCode: e.target.value })
            }
          />
        </div>
      </>
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!appState.isSDKReady) {
      setHitOk({ error: ERROR_SDK_NOT_READY, ok: false });
      return;
    }

    if (!appState.hasVisitor) {
      setHitOk({ error: ERROR_VISITOR_NOT_SET, ok: false });
      return;
    }

    console.log(hit);

    fs.hit
      .send({
        ...hit,
        screenResolution: `${screenWidth}X${screenHeight}`,
      } as IHit)
      .then(() => {
        setHitOk({ error: "", ok: true });
      });
  };

  const isNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) {
      e.preventDefault();
      return false;
    }
    return true;
  };

  return (
    <div>
      <h2 className="mt-5">Send Hit</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Hit type</label>
          <select
            className="form-control"
            required
            value={hit.type || ""}
            onChange={(e) =>
              setHit({ type: e.target.value } as IHit)
            }
          >
            {hitTypes.map((hitType, index) => (
              <option value={hitType} key={index}>
                {hitType}
              </option>
            ))}
          </select>
        </div>

        {hit.type === HitType.EVENT && HitEventInput()}
        {hit.type === HitType.TRANSACTION && HitTransactionInput()}
        {hit.type === HitType.ITEM && HitItemInput()}

        {[HitType.SCREEN, HitType.PAGE].includes(hit.type as HitType) && (
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Location"
              value={(hit as IScreen).documentLocation || ""}
              onChange={(e) =>
                setHit({ ...hit, documentLocation: e.target.value })
              }
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Resolution Width (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Resolution Width"
            value={screenWidth || ""}
            onChange={(e) => setScreenWidth(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Resolution Height (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Resolution Height"
            value={screenHeight || ""}
            onChange={(e) => setScreenHeight(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Local (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Local"
            value={hit.locale || ""}
            onChange={(e) => setHit({ ...hit, locale: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Ip (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ip"
            value={hit.userIp || ""}
            onChange={(e) => setHit({ ...hit, userIp: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Session number (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Session number"
            value={hit.sessionNumber || ""}
            onChange={(e) => setHit({ ...hit, sessionNumber: e.target.value })}
          />
        </div>

        {hitOk.error && (
          <div className="alert alert-danger">
            {JSON.stringify(hitOk.error)}
          </div>
        )}

        {hitOk.ok && <div className="alert alert-success">Hit sent OK !</div>}

        <button type="submit" className="btn btn-info">
          Send event
        </button>
      </form>
    </div>
  );
}
