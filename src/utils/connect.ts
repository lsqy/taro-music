import { connect as connectComponent } from 'react-redux';
export const connect = (mapStateToProps: any, actions: any) => {
  return (target: any) => (
    connectComponent(mapStateToProps, actions)(target) as any
  );
};