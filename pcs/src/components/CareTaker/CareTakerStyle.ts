import { colors } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
   root: {
      height: '100%'
    },
    avatar: {
      backgroundColor: '#ff6c37',
      height: 56,
      width: 56
    },
    increaseIcon: {
      color: colors.green[300]
    },
    increaseValue: {
      color: colors.green[300],
      marginRight: theme.spacing(1)
    },
    decreaseIcon: {
      color: colors.red[900]
    },
    decreaseValue: {
      color: colors.red[900],
      marginRight: theme.spacing(1)
    },
    equalIcon: {
      color: colors.blue[300]
    },
    equalValue: {
      color: colors.blue[300],
      marginRight: theme.spacing(1)
    },
    avatarBlue: {
      backgroundColor: 'blue',
      height: 56,
      width: 56
    },
    avatarGreen: {
      backgroundColor: 'green',
      height: 56,
      width: 56
    },
    avatarOrange: {
      backgroundColor: 'orange',
      height: 56,
      width: 56
    },
}));
