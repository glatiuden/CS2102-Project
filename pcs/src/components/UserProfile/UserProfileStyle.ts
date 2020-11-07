import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  selectionInput: {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
  }
}));
