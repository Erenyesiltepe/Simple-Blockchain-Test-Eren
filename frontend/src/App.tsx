import { useState } from 'react'
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
  Badge
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

// Generate dummy data for better scroll testing
const generateDummyData = (count: number) => {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      from: `0x${Math.random().toString(16).slice(2, 42)}`,
      to: `0x${Math.random().toString(16).slice(2, 42)}`,
      amount: `${(Math.random() * 5).toFixed(2)} ETH`,
      hash: `0x${Math.random().toString(16).slice(2, 64)}`
    })
  }
  return data
}

const dummyNotifications = generateDummyData(15) // Generate 15 notifications for testing

function App() {
  const [notifications] = useState(dummyNotifications)

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
          {notifications.map((notification) => (
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
    </Box>
  )
}

export default App
