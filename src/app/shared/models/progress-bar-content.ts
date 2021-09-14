export interface ProgressBarContent {
  animated: boolean;
  value: number;
  striped: boolean;
  type:
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger';
  text: string;
}
