"use client";
import { useApp } from "../store";
import ReservationList from "../ui/ReservationList";
import { scopedBookings } from "@/lib/domain/selectors";

/** The "All reservations" list reached from Home and the More hub. Uses the
 *  current scope, same as the Bookings list view. */
export default function ReservationsScreen() {
  const { state, data } = useApp();
  const bk = scopedBookings(data.bookings, state.scope);
  return (
    <div className="dt-screen" style={{ padding: "16px 16px 24px" }}>
      <ReservationList bookings={bk} />
    </div>
  );
}
