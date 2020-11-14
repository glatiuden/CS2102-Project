import { Avatar } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { yellow } from '@material-ui/core/colors';
import { createStyles, fade, makeStyles, Theme, withStyles } from '@material-ui/core/styles';

const drawerWidth = 300;

export const useStyles = makeStyles(theme => ({
	root: {
		display: "flex"
	},
	list: {
		width: window.innerWidth,
		maxWidth: window.innerWidth - 20,
		backgroundColor: theme.palette.background.paper
	},
	modalList: {
		width: "100%",
		backgroundColor: theme.palette.background.paper
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	stickToBottom: {
		width: "100%",
		position: "fixed",
		bottom: 0
	},
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	paper: {
		padding: theme.spacing(1),
		textAlign: "center",
		color: theme.palette.text.secondary
	},
	icon: {
		color: theme.palette.secondary.contrastText
	},
	card: {
		paddingTop: 25,
		margin: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		textAlign: "center",
		alignItems: "center",
		width: "90%"
	},
	contentCard: {
		margin: 5,
		width: "95%",
		height: "100%",
	},
	grid: {
		flexGrow: 1,
		padding: theme.spacing(1)
	},
	title: {
		flexGrow: 1,
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block"
		},
		color: theme.palette.primary.contrastText
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(1),
			width: "auto"
		}
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	inputRoot: {
		color: "inherit"
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
		width: "12ch",
		"&:focus": {
			width: "20ch"
		}
		}
	},
	avatar: {
		display: "flex",
		"& > *": {
		margin: theme.spacing(1)
		}
	},
	inline: {
		display: "inline"
	},
	fab: {
		position: "absolute",
		bottom: theme.spacing(9),
		right: theme.spacing(2)
	},
	margin: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1)
	},
	loading: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	cardTitle: {
		fontSize: 14
	},
	moodCard: {
		minWidth: window.innerWidth - drawerWidth - 50,
		marginBottom: "0.5%"
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText
	},
	drawerContainer: {
		overflow: "auto"
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	alignItemsAndJustifyContent: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	largeAvatar: {
		width: theme.spacing(20),
		height: theme.spacing(20),
		textAlign: "center"
	 },
	medAvatar: {
		width: theme.spacing(10),
		height: theme.spacing(10),
	},
	ctAvatar: {
		width: theme.spacing(17),
		height: theme.spacing(17),
		textAlign: "center"
  	},
	center: {   
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	dialogTitle: {
		backgroundColor: theme.palette.primary.light,
		color: "white"
	},
	fixedHeight: {
		height: 150,
		padding: theme.spacing(2),	
	  },
	depositContext: {
    	flex: 1,
	  },
	selectionInput: {
		borderRadius: 4,
		position: "relative",
		border: "1px solid #ced4da",
		fontSize: 16,
		padding: "10px 26px 10px 12px",
		transition: theme.transitions.create(["border-color", "box-shadow"])
	  },
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: 'white',
    },
}));

export const EndedBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      backgroundColor: "red",
      color: "red",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "$ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""'
      }
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0
      }
    }
  })
)(Badge);

export const SmallAvatar = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 50,
      height: 50,
	  border: `2px solid ${theme.palette.background.paper}`,
	  color: 'gold',
		backgroundColor: 'white'
    },
  }),
)(Avatar);

export const OngoingBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "$ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""'
      }
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0
      }
    }
  })
)(Badge);
