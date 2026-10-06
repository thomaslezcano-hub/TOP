/* Boot order matters: attribution first (events need the ref), then tracking, then UI. */
Attribution.init();
Analytics.init();
UI.init();
Booking.init();
