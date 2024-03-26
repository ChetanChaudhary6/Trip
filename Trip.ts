interface Trip {
    start: string;
    end: string;
  }
  
  function isValidTrip(trip: Trip, pickups: Set<string>, dropoffs: Set<string>): boolean {
    // Check if starting point is not a drop point and end point is not a pickup point
    return !dropoffs.has(trip.start) && !pickups.has(trip.end);
  }
  
  function areValidTrips(trips: Trip[], pickups: Set<string>, dropoffs: Set<string>): boolean {
    // Check if all trips are valid
    return trips.every(trip => isValidTrip(trip, pickups, dropoffs)) &&
      areSingleChild(pickups, dropoffs);
  }
  
  function areSingleChild(pickups: Set<string>, dropoffs: Set<string>): boolean {
    // Check if each point has only one child
    const childrenCount = new Map<string, number>();
  
    // Count children for each point
    pickups.forEach(point => childrenCount.set(point, 0));
    dropoffs.forEach(point => childrenCount.set(point, 0));
  
    // Count children for each point based on trips
    pickups.forEach(point => {
      trips.forEach(trip => {
        if (trip.start === point) {
          childrenCount.set(point, childrenCount.get(point)! + 1);
        }
      });
    });
    dropoffs.forEach(point => {
      trips.forEach(trip => {
        if (trip.end === point) {
          childrenCount.set(point, childrenCount.get(point)! + 1);
        }
      });
    });
  
    // Check if any point has more than one child
    return Array.from(childrenCount.values()).every(count => count <= 1);
  }
  function removeVisitedTrips(startPoint: string, tripMap: Map<string, Set<string>>, dropoffs: Set<string>): void {
    const endPoints = tripMap.get(startPoint);
    if (!endPoints) return;
  
    endPoints.forEach(endPoint => {
      if (dropoffs.has(endPoint)) {
        // Remove the dropoff point from the set
        dropoffs.delete(endPoint);
      } else {
        // Recursively traverse the map
        removeVisitedTrips(endPoint, tripMap, dropoffs);
      }
      // Remove the trip data from the map
      endPoints.delete(endPoint);
    });
  }
  
  function areValidTripsRecursion(trips: Trip[], pickups: Set<string>, dropoffs: Set<string>): boolean {

    const tripMap = new Map<string, Set<string>>();
  
    // Initialize trip map
    pickups.forEach(pickup => tripMap.set(pickup, new Set()));
  
    // Store trip data in the map if trips are valid
    for (const trip of trips) {
      if (pickups.has(trip.start) && !dropoffs.has(trip.end)) {
        tripMap.get(trip.start)?.add(trip.end);
      } else {
        // If any trip is not valid, return false
        return false;
      }
    }
  
    // Remove visited trips and dropoff points
    pickups.forEach(pickup => {
      removeVisitedTrips(pickup, tripMap, dropoffs);
    });
  
    // Check if both trip data and dropoff data are empty
    return Array.from(tripMap.values()).every(set => set.size === 0) && dropoffs.size === 0;
  }
  // Example datasets for pickups and dropoffs (set of characters)
  const pickups = new Set(['A', 'B', 'C']);
  const dropoffs = new Set(['X', 'Y', 'Z']);
  
  // Example list of trips
  const trips: Trip[] = [
    { start: 'A', end: 'X' },
    { start: 'B', end: 'Y' },
    { start: 'C', end: 'Z' }
  ];
  
  // Check if the list of trips is valid
  var isValid = areValidTrips(trips, pickups, dropoffs);
  if(isValid){
    isValid&&=areValidTripsRecursion(trips, pickups, dropoffs);
  }
  console.log('Are the trips valid?', isValid);
  