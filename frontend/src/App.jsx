import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userPhone, setUserPhone] = useState(localStorage.getItem('userPhone'))
  const [banks, setBanks] = useState([])
  
  // Login form
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  
  // Blocking form
  const [selectedBank, setSelectedBank] = useState('')
  const [cardType, setCardType] = useState('debit')
  const [last4, setLast4] = useState('')
  const [blockMethod, setBlockMethod] = useState('sms')
  
  // Bank directory
  const [bankSearch, setBankSearch] = useState('')

  useEffect(() => {
    fetchBanks()
  }, [])

  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${API_URL}/banks`)
      setBanks(response.data)
    } catch (error) {
      console.error('Error fetching banks:', error)
    }
  }

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/auth/request-otp`, {
        phoneNumber: '+91' + phone
      })
      alert('OTP sent to your phone')
    } catch (error) {
      alert('Error: ' + error.response?.data?.error)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        phoneNumber: '+91' + phone,
        otp: otp
      })
      setToken(response.data.token)
      setUserPhone(response.data.user.phoneNumber)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userPhone', response.data.user.phoneNumber)
      setCurrentScreen('dashboard')
    } catch (error) {
      alert('Invalid OTP: ' + error.response?.data?.error)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setUserPhone(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userPhone')
    setCurrentScreen('login')
    setPhone('')
    setOtp('')
  }

  const handleBlockCard = async (method = blockMethod) => {
    if (!selectedBank || !cardType || !last4) {
      alert('Please fill all fields')
      return
    }

    try {
      const bankInfo = banks.find(b => b._id === selectedBank)
      const isCredit = cardType === 'credit'
      const smsData = isCredit ? bankInfo.creditCardSMS : bankInfo.debitCardSMS
      
      await axios.post(`${API_URL}/activity/log`, 
        {
          action: 'block_' + method + '_initiated',
          bankName: bankInfo.name,
          cardType: cardType
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setCurrentScreen('sms-confirmation')
    } catch (error) {
      alert('Error: ' + error.response?.data?.error)
    }
  }

  const getCurrentBankInfo = () => {
    const bank = banks.find(b => b._id === selectedBank)
    if (!bank) return null
    
    const isCredit = cardType === 'credit'
    return {
      name: bank.name,
      sms: isCredit ? bank.creditCardSMS : bank.debitCardSMS,
      email: isCredit ? bank.creditCardEmail : bank.debitCardEmail,
      phone: bank.customerCareNumber
    }
  }

  const filteredBanks = banks.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  )

  const bankInfo = getCurrentBankInfo()
  const smsMessage = `BLOCK ${cardType.toUpperCase()} ****${last4}`

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="container">
        <div className="card login-card">
          <div className="logo">
            <i className="ti ti-alert-circle"></i>
          </div>
          <h1>Card Guardian</h1>
          <p className="subtitle">Block cards in emergencies</p>

          <form onSubmit={handleRequestOTP} className="form">
            <div className="form-group">
              <label>Phone number</label>
              <div className="input-group">
                <input type="text" value="+91" disabled className="input-prefix" />
                <input
                  type="tel"
                  placeholder="9876 543210"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-full"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Verification code</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-full"
              />
              <small>Check your SMS for OTP</small>
            </div>

            <button type="submit" className="btn btn-primary">
              Request OTP
            </button>
          </form>

          <div style={{ marginTop: '16px' }}>
            <button onClick={handleVerifyOTP} className="btn btn-secondary" style={{ marginBottom: 0 }}>
              Verify OTP & Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // DASHBOARD SCREEN
  if (currentScreen === 'dashboard') {
    return (
      <div className="container">
        <div className="card">
          <div className="header-user">
            <div>
              <p className="text-muted">Welcome back</p>
              <h2>User</h2>
            </div>
            <div className="avatar">RS</div>
          </div>

          <div className="alert alert-danger" style={{ marginTop: '20px' }}>
            <i className="ti ti-alert-triangle"></i>
            <div>
              <strong>Emergency? Block instantly</strong>
              <p>No card details stored for privacy</p>
            </div>
          </div>

          <p className="label" style={{ marginTop: '20px' }}>Quick actions</p>

          <div className="card-action" onClick={() => setCurrentScreen('blocking')}>
            <i className="ti ti-phone"></i>
            <div>
              <h3>Block a card</h3>
              <p>SMS, email, or call bank</p>
            </div>
            <i className="ti ti-chevron-right"></i>
          </div>

          <div className="card-action" onClick={() => setCurrentScreen('bank-directory')}>
            <i className="ti ti-building-bank"></i>
            <div>
              <h3>Find bank contacts</h3>
              <p>{banks.length}+ banks directory</p>
            </div>
            <i className="ti ti-chevron-right"></i>
          </div>

          <button className="btn btn-primary" onClick={() => setCurrentScreen('blocking')}>
            Start blocking now
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    )
  }

  // BLOCKING SCREEN
  if (currentScreen === 'blocking') {
    return (
      <div className="container">
        <div className="card">
          <button className="back-btn" onClick={() => setCurrentScreen('dashboard')}>
            <i className="ti ti-arrow-left"></i> Back
          </button>

          <h2>Block your card</h2>

          <div className="form-group">
            <label>Select bank</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="input-full"
            >
              <option value="">Choose bank...</option>
              {banks.map(bank => (
                <option key={bank._id} value={bank._id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Card type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                className={`btn ${cardType === 'debit' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCardType('debit')}
              >
                Debit
              </button>
              <button
                className={`btn ${cardType === 'credit' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCardType('credit')}
              >
                Credit
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Last 4 digits</label>
            <input
              type="text"
              placeholder="e.g., 8765"
              maxLength="4"
              value={last4}
              onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
              className="input-full"
            />
            <small>⚠️ Only last 4 digits. Never share full card number.</small>
          </div>

          <div style={{ borderTop: '1px solid #ddd', margin: '16px 0' }}></div>

          <p className="label">Choose method</p>

          <div
            className="card-method"
            style={{
              backgroundColor: blockMethod === 'sms' ? '#e8f4f8' : '#f5f5f5',
              borderColor: blockMethod === 'sms' ? '#0066cc' : '#ddd'
            }}
            onClick={() => {
              setBlockMethod('sms')
              handleBlockCard('sms')
            }}
          >
            <i className="ti ti-phone"></i>
            <div>
              <h3>Send SMS</h3>
              <p>Fastest option (2-5 min)</p>
            </div>
            {blockMethod === 'sms' && <i className="ti ti-check"></i>}
          </div>

          <div className="card-method" onClick={() => setBlockMethod('email')}>
            <i className="ti ti-mail"></i>
            <div>
              <h3>Send email</h3>
              <p>Auto-draft and send</p>
            </div>
            <i className="ti ti-chevron-right"></i>
          </div>

          <button className="btn btn-primary" onClick={handleBlockCard}>
            Proceed to {blockMethod === 'sms' ? 'SMS' : 'Email'}
          </button>
        </div>
      </div>
    )
  }

  // SMS CONFIRMATION SCREEN
  if (currentScreen === 'sms-confirmation' && bankInfo) {
    return (
      <div className="container">
        <div className="card">
          <button className="back-btn" onClick={() => setCurrentScreen('blocking')}>
            <i className="ti ti-arrow-left"></i> Back
          </button>

          <h2>Block via SMS</h2>

          <div className="alert alert-warning">
            <i className="ti ti-info-circle"></i>
            <p>{bankInfo.name} will confirm within 2-5 minutes</p>
          </div>

          <div style={{
            background: '#eef7ee',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #cfe8cf'
          }}>
            <p className="label" style={{ marginTop: 0 }}>How to send this SMS</p>
            <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', lineHeight: '1.7' }}>
              <li>Open the SMS/messaging app on the mobile phone registered with {bankInfo.name}.</li>
              <li>Start a new message addressed to the number shown below.</li>
              <li>Tap "Copy" to copy the exact message below, then paste it into the SMS (or type it exactly as shown).</li>
              <li>Send the SMS from your registered mobile number only — it will not work from any other number.</li>
              <li>Wait 2-5 minutes for a confirmation reply from {bankInfo.name} that your card is blocked.</li>
              <li>Once you've sent it, tap "I've sent the SMS" below to log this action.</li>
            </ol>
          </div>

          <div style={{
            background: '#f5f5f5',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <p className="text-muted" style={{ fontSize: '11px' }}>Send to</p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <code style={{ flex: 1, fontSize: '14px', fontWeight: 'bold' }}>
                {bankInfo.sms?.number || 'N/A'}
              </code>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0066cc' }}
                onClick={() => {
                  navigator.clipboard.writeText(bankInfo.sms?.number || '')
                  alert('SMS number copied!')
                }}
              >
                <i className="ti ti-copy"></i> Copy
              </button>
            </div>
          </div>

          <label className="label">Message to send</label>
          <textarea
            readOnly
            value={smsMessage}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              minHeight: '80px',
              marginBottom: '12px'
            }}
          />
          <small>Auto-prepared. Copy and paste into SMS.</small>

          <button className="btn btn-primary" onClick={() => {
            alert('Block request sent! Check SMS confirmation from ' + bankInfo.name)
            setCurrentScreen('dashboard')
          }}>
            I've sent the SMS
          </button>
          <button className="btn btn-secondary" onClick={() => setCurrentScreen('blocking')}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // BANK DIRECTORY SCREEN
  if (currentScreen === 'bank-directory') {
    return (
      <div className="container">
        <div className="card">
          <button className="back-btn" onClick={() => setCurrentScreen('dashboard')}>
            <i className="ti ti-arrow-left"></i> Back
          </button>

          <h2>Supported banks</h2>

          <input
            type="text"
            placeholder="Search banks..."
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            className="input-full"
            style={{ marginBottom: '16px' }}
          />

          <div>
            {filteredBanks.map(bank => (
              <div
                key={bank._id}
                className="bank-item"
                onClick={() => {
                  setSelectedBank(bank._id)
                  setCurrentScreen('blocking')
                }}
              >
                <div>
                  <h3>{bank.name}</h3>
                  <p>{bank.supportedMethods.join(' • ')}</p>
                </div>
                <i className="ti ti-chevron-right"></i>
              </div>
            ))}
          </div>

          {filteredBanks.length === 0 && (
            <p className="text-muted" style={{ textAlign: 'center', marginTop: '20px' }}>
              No banks found
            </p>
          )}

          <p className="text-muted" style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px' }}>
            {banks.length - filteredBanks.length} more banks available
          </p>
        </div>
      </div>
    )
  }

  return null
}
