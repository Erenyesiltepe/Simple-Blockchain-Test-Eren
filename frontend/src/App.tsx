import { useState, useEffect } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  List, 
  ListItem, 
  Card, 
  CardContent, 
  Box,
  IconButton,
  Badge,
  Snackbar,
  Alert
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { requestNotificationPermission, messaging } from './firebase'
import { onMessage } from 'firebase/messaging';

interface Notification {
  id: string;
  from: string;
  to: string;
  amount: string;
  hash: string;
  timestamp: number;
}

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  useEffect(() => {

    requestNotificationPermission()
      .then(() => console.log('Notification permission granted'))
      .catch((err) => console.error('Error requesting notification permission:', err));

    onMessage(messaging, (payload: any) => {
        const { from, to, amount, hash } = JSON.parse(payload.notification.body);

        const newNotification: Notification = {
          id: hash,
          from,
          to,
          amount: `${amount} USDT`,
          hash,
          timestamp: Date.now()
        };

        console.log('Received foreground message:', newNotification);
        setNotifications(prev => [newNotification, ...prev]);
        setNotificationMessage(`New transfer: ${amount} USDT`);
        setShowNotification(true);
    });
  }, [])

  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              textAlign: { xs: 'left', sm: 'center' },
              ml: { sm: 8 }
            }}
          >
            Blockchain Transaction Notifications
          </Typography>
          <IconButton color="inherit" sx={{ mr: { sm: 8 } }}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth="md" 
        sx={{ 
          mt: 4,
          mb: 4,
          flex: 1
        }}
      >
        <List sx={{ p: 0 }}>
          {notifications.sort((a, b) => b.timestamp - a.timestamp).map((notification) => (
            <ListItem key={notification.id} sx={{ mb: 2, p: 0 }}>
              <Card 
                sx={{ 
                  width: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 6
                  }
                }}
                elevation={2}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: '#1976d2',
                      fontWeight: 600,
                      pb: 1,
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    Transaction Notification
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gap: 2,
                    mt: 2
                  }}>
                    <Typography variant="body1">
                      <Box component="span" sx={{ 
                        color: '#666',
                        fontWeight: 600,
                        mr: 1
                      }}>From:</Box>
                      {notification.from}
                    </Typography>
                    <Typography variant="body1">
                      <Box component="span" sx={{ 
                        color: '#666',
                        fontWeight: 600,
                        mr: 1
                      }}>To:</Box>
                      {notification.to}
                    </Typography>
                    <Typography variant="body1">
                      <Box component="span" sx={{ 
                        color: '#666',
                        fontWeight: 600,
                        mr: 1
                      }}>Amount:</Box>
                      {notification.amount}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        wordBreak: 'break-all'
                      }}
                    >
                      <Box component="span" sx={{ 
                        color: '#666',
                        fontWeight: 600,
                        mr: 1,
                        wordBreak: 'normal'
                      }}>Transaction Hash:</Box>
                      {notification.hash}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </Container>

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowNotification(false)} 
          severity="info" 
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default App
