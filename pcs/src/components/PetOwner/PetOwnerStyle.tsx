import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  petForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
      '& .MuiFilledInput-root': {
        backgroundColor: 'white'
      }
    },
    '& Button': {
      marginTop: '10px',
      marginLeft: '8px',
      marginBottom: '10px'
    }
  },
  petCard: {
    paddingTop: 25,
    margin: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    width: "90%"
  }
}));