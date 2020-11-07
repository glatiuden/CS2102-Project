import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    // backgroundImage: 'url(https://source.unsplash.com/featured/?pets)',
    backgroundImage: 'url(https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i.sh5FWBwSKs/v0/1000x-1.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(10, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
	divider: {
		margin: theme.spacing(3, 0),
	},
  tabTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabIndicator: {
    backgroundColor: 'white'
  },
  tabBorder: {
    borderRadius: 4,
    border: "1px solid #ced4da",
  },
  selectionInput: {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
  }
}));
