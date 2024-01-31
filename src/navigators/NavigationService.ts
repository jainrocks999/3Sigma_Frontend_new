import * as React from 'react';

export const navigationRef = React.createRef<any>();

export function navigate(name: string, params: any) {
  navigationRef.current.navigate(name, params);
}

export function goBack() {
  navigationRef.current.goBack();
}
export function canGoBack() {
  return navigationRef.current.canGoBack();
}

export function reset(name: string, index: number) {
  navigationRef.current.reset({
    index: index,
    routes: [{name: name}],
  });
}
