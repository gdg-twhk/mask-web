export interface LoadStoreRequest {
  center: LatLng;
  bounds: {
    ne: LatLng;
    se: LatLng;
    sw: LatLng;
    nw: LatLng;
  };
  max: number;
}

export interface CurrentBouds {
  center: LatLng;
  bounds: {
    ne: LatLng;
    se: LatLng;
    sw: LatLng;
    nw: LatLng;
  };
}

export interface LatLng {
  lat: number;
  lng: number;
}
