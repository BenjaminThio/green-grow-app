'use client';
import { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import map from './../public/map.jpg';

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState('onboarding');
  const [joinedEvents, setJoinedEvents] = useState(new Set());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeMapFilter, setActiveMapFilter] = useState('all');
  const [selectedPin, setSelectedPin] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    category: '',
    severity: '',
    photo: null
  });
  const users = useRef([]);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'report',
      title: 'Report #23 acknowledged by City Council',
      time: '5 min ago',
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Your tree "Class 5A Hope" reminder: Water today',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'event',
      title: 'Community Tree Planting @ Seri Park – starts in 1 hour',
      time: '2 hours ago',
      read: true
    }
  ]);
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'citizen'
  });

  // Added states from admin.jsx (adapted)
  const [activeTab, setActiveTab] = useState('events');
  const [filters, setFilters] = useState({
    status: '',
    organizerType: '',
    date: '',
    search: '',
    urgency: '',
    reportStatus: ''
  });
  const [selectedReports, setSelectedReports] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionType, setActionType] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({});
  const mapContainerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const scrollTopRef = useRef(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);

    // record mouse start positions
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;

    // record container scroll start
    scrollLeftRef.current = mapContainerRef.current.scrollLeft;
    scrollTopRef.current = mapContainerRef.current.scrollTop;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    // movement since start
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    // apply both horizontal and vertical scroll
    mapContainerRef.current.scrollLeft = scrollLeftRef.current - dx;
    mapContainerRef.current.scrollTop = scrollTopRef.current - dy;
  };

  const onboardingSlides = [
    {
      title: "Join community tree-planting events easily",
      description: "Connect with local environmental groups and participate in organized tree planting activities near you.",
      image: "https://placehold.co/300x200/22c55e/ffffff?text=Community+Events"
    },
    {
      title: "Adopt and track your trees with photos",
      description: "Take ownership of planted trees, monitor their growth, and share progress photos with the community.",
      image: "https://placehold.co/300x200/16a34a/ffffff?text=Tree+Tracking"
    },
    {
      title: "Report and monitor green zones near you",
      description: "Help map urban green spaces and contribute to environmental conservation efforts in your neighborhood.",
      image: "https://placehold.co/300x200/15803d/ffffff?text=Green+Zones"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Community Tree Planting @ Taman Seri Park",
      date: "Sun, 2 June 2025",
      time: "9:00 AM",
      volunteers: 25,
      tools: ["Gloves", "Shovel", "Water Bottle"],
      image: "https://placehold.co/300x160/22c55e/ffffff?text=Taman+Seri+Park",
      location: "Taman Seri Park, Kuala Lumpur",
      organizer: "Green Community Group"
    },
    {
      id: 2,
      title: "Urban Forest Restoration @ Bukit Gasing",
      date: "Sat, 8 June 2025",
      time: "8:30 AM",
      volunteers: 18,
      tools: ["Gloves", "Pruning Shears", "Watering Can"],
      image: "https://placehold.co/300x160/16a34a/ffffff?text=Bukit+Gasing",
      location: "Bukit Gasing, Selangor",
      organizer: "Nature Conservation Society"
    }
  ];

  const [visibility, setVisibility] = useState(
    [false, false, false, false]
  );

  const mapPins = [
    {
      id: 1,
      type: 'urgent',
      lat: 300.634,
      lng: 405.20,
      title: "Broken Irrigation Pipe",
      description: "Main water line broken near playground",
      category: "Facility Damage",
      status: "Open",
      date: "Today",
      photo: "https://placehold.co/200x120/ef4444/ffffff?text=Broken+Pipe",
      timeline: [
        { status: "Submitted", date: "Jun 1, 2025", notes: "Report submitted by citizen" },
        { status: "Acknowledged", date: "Jun 1, 2025", notes: "City Council acknowledged" },
        { status: "In Progress", date: "Jun 2, 2025", notes: "Crew scheduled for Jun 3" }
      ],
    },
    {
      id: 2,
      type: 'medium',
      lat: 725.834,
      lng: 50.688,
      title: "Tree Fungus Spotted",
      description: "Fungal growth observed on oak tree trunk",
      category: "Tree Health",
      status: "Open",
      date: "Yesterday",
      photo: "https://placehold.co/200x120/eab308/ffffff?text=Fungus",
      timeline: [
        { status: "Submitted", date: "May 30, 2025", notes: "Report submitted" },
        { status: "Acknowledged", date: "May 31, 2025", notes: "Parks Department reviewing" }
      ],
    },
    {
      id: 3,
      type: 'event',
      lat: 950.80,
      lng: 284.567,
      title: "Community Tree Planting",
      description: "Monthly planting event this Sunday",
      category: "Event",
      status: "Upcoming",
      date: "Sun, 2 June",
      photo: "https://placehold.co/200x120/22c55e/ffffff?text=Planting+Event",
    },
    {
      id: 4,
      type: 'healthy',
      lat: 1300.32,
      lng: 100.12,
      title: "Healthy Mangrove Zone",
      description: "Thriving mangrove ecosystem",
      category: "Green Zone",
      status: "Monitored",
      date: "Last week",
      photo: "https://placehold.co/200x120/16a34a/ffffff?text=Healthy+Zone",
    }
  ];

  // Adapted initial reports from mapPins
  const initialReports = mapPins
    .filter(p => p.type === 'urgent' || p.type === 'medium')
    .map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      urgency: p.type === 'urgent' ? 'high' : 'medium',
      date: p.date === 'Today' ? '2025-09-05' : p.date === 'Yesterday' ? '2025-09-04' : p.date,
      reporter: user?.name || 'Anonymous Citizen',
      status: 'pending',
      category: p.category
    }));
  
    const [reports, setReports] = useState(initialReports);

  const myTrees = [
    {
      id: 1,
      name: "Class 5A Hope 🌱",
      status: "Healthy",
      lastUpdate: "7 days ago",
      photo: "https://placehold.co/80x80/22c55e/ffffff?text=Tree+1",
      updates: [
        { date: "2 days ago", photo: "https://placehold.co/100x80/22c55e/ffffff?text=New+Growth", note: "New leaves emerging!" },
        { date: "1 week ago", photo: "https://placehold.co/100x80/16a34a/ffffff?text=Watered", note: "Watered and mulched" },
        { date: "3 weeks ago", photo: "https://placehold.co/100x80/15803d/ffffff?text=Planted", note: "First planting day" }
      ]
    },
    {
      id: 2,
      name: "Rainbow Sapling 🌈",
      status: "Thriving",
      lastUpdate: "3 days ago",
      photo: "https://placehold.co/80x80/16a34a/ffffff?text=Tree+2",
      updates: [
        { date: "3 days ago", photo: "https://placehold.co/100x80/22c55e/ffffff?text=Flowers", note: "First flowers bloomed!" },
        { date: "2 weeks ago", photo: "https://placehold.co/100x80/16a34a/ffffff?text=Growth", note: "Grown 15cm taller" }
      ]
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Joined your first event",
      icon: "🌱",
      earned: true,
      date: "Mar 15, 2025"
    },
    {
      id: 2,
      title: "Tree Guardian",
      description: "Adopted 5 trees",
      icon: "🌳",
      earned: true,
      date: "Apr 2, 2025"
    },
    {
      id: 3,
      title: "Eagle Eye",
      description: "Submitted 10 reports",
      icon: "🔍",
      earned: false,
      progress: 7,
      total: 10
    },
    {
      id: 4,
      title: "Community Builder",
      description: "Invited 3 friends",
      icon: "👥",
      earned: false,
      progress: 1,
      total: 3
    },
    {
      id: 5,
      title: "Green Veteran",
      description: "1 year with GreenGrow",
      icon: "🏆",
      earned: false
    }
  ];

  const adminReports = [...mapPins.filter(p => p.type === 'urgent' || p.type === 'medium')];

  // Functions from admin.jsx (adapted)
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStatusChange = (eventId, newStatus, reason = '') => {
    setAdminEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          status: newStatus,
          approvedAt: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : event.approvedAt,
          rejectionReason: reason
        };
      }
      return event;
    }));
  };

  const handleCreateEvent = (eventData) => {
    const newEvent = {
      id: Math.max(...adminEvents.map(e => e.id)) + 1,
      ...eventData,
      status: 'local_authority' === 'citizen' ? 'pending' : 'approved',
      type: 'local_authority' === 'citizen' ? 'proposed' : 
            'local_authority' === 'verified_organizer' ? (eventData.instantPublish ? 'published' : 'submitted') : 'published',
      createdAt: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString().split('T')[0],
      createdBy: 'local_authority'
    };
    
    setAdminEvents(prev => [...prev, newEvent]);
    setShowCreateModal(false);
    setShowProposalModal(false);
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAllReports = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(r => r.id));
    }
  };

  const handleAssignDepartment = (department) => {
    if (selectedReports.length === 0) return;
    
    setReports(prev => prev.map(report => 
      selectedReports.includes(report.id)
        ? { ...report, assignedTo: department, status: "assigned" }
        : report
    ));
    
    setSelectedReports([]);
  };

  const handleStatusUpdate = (reportId, update) => {
    setStatusUpdates(prev => ({
      ...prev,
      [reportId]: [
        ...(prev[reportId] || []),
        {
          id: Date.now(),
          text: update,
          timestamp: new Date().toLocaleString()
        }
      ]
    }));
  };

    // Adapted initial events from existing events
  const initialEvents = events.map((e, index) => ({
    id: e.id,
    title: e.title,
    description: `Participate in ${e.title.toLowerCase()} organized by ${e.organizer}.`,
    organizer: e.organizer,
    organizerType: index === 0 ? 'ngo' : 'ra',
    status: 'approved',
    type: 'published',
    date: index === 0 ? '2025-06-02' : '2025-06-08',
    location: e.location,
    participants: e.volunteers,
    createdAt: '2025-05-01',
    submittedAt: '2025-05-01',
    approvedAt: '2025-05-01',
    createdBy: 'local_authority'
  }));

  const [adminEvents, setAdminEvents] = useState(initialEvents);

  const handleExport = (type) => {
    if (type === 'events') {
      const headers = ['ID', 'Title', 'Organizer', 'Status', 'Date', 'Location', 'Participants', 'Type', 'Created By'];
      const csvContent = [
        headers.join(','),
        ...filteredEvents.map(e => 
          [e.id, e.title, e.organizer, e.status, e.date, e.location, e.participants, e.type, e.createdBy]
            .map(field => `"${field}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `greengrow-events-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['ID', 'Title', 'Urgency', 'Date', 'Reporter', 'Status', 'Assigned To'];
      const csvContent = [
        headers.join(','),
        ...filteredReports.map(r => 
          [r.id, r.title, r.urgency, r.date, r.reporter, r.status, r.assignedTo || 'Unassigned']
            .map(field => `"${field}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `greengrow-reports-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Memoized filtered data from admin.jsx
  const filteredEvents = adminEvents.filter(event => {
    const statusMatch = !filters.status || event.status === filters.status;
    const organizerMatch = !filters.organizerType || event.organizerType === filters.organizerType;
    const dateMatch = !filters.date || event.date === filters.date;
    const searchMatch = !filters.search || 
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.organizer.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.location.toLowerCase().includes(filters.search.toLowerCase());
    
    return statusMatch && organizerMatch && dateMatch && searchMatch;
  });

  const filteredReports = reports.filter(report => {
    const urgencyMatch = !filters.urgency || report.urgency === filters.urgency;
    const statusMatch = !filters.reportStatus || report.status === filters.reportStatus;
    const dateMatch = !filters.date || report.date === filters.date;
    const searchMatch = !filters.search || 
      report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.reporter.toLowerCase().includes(filters.search.toLowerCase());
    return urgencyMatch && statusMatch && dateMatch && searchMatch;
  });

  // Badge functions from admin.jsx
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      published: 'bg-blue-100 text-blue-800 border-blue-200',
      assigned: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getOrganizerBadge = (type) => {
    const badges = {
      citizen: 'bg-purple-100 text-purple-800 border-purple-200',
      ngo: 'bg-green-100 text-green-800 border-green-200',
      school: 'bg-blue-100 text-blue-800 border-blue-200',
      ra: 'bg-orange-100 text-orange-800 border-orange-200',
      local_authority: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return badges[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const UrgencyBadge = ({ urgency }) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors[urgency]}`}>
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
      </span>
    );
  };

  // Modal components from admin.jsx (adapted)
  const CreateEventModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      date: '',
      location: '',
      participants: '',
      instantPublish: false
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleCreateEvent(formData);
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg font-medium text-green-900 mb-4">
              Create Green Event
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Community Garden Planting"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Central Park Community Garden"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Describe the environmental impact and activities..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Expected Participants
                  </label>
                  <input
                    type="number"
                    name="participants"
                    value={formData.participants}
                    onChange={handleChange}
                    className="text-green-700 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="mb-4 p-4 bg-green-50 rounded-md border border-green-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="instantPublish"
                    name="instantPublish"
                    checked={formData.instantPublish}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                  />
                  <label htmlFor="instantPublish" className="ml-2 block text-sm text-green-700">
                    Publish instantly (bypass approval process)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const ActionModal = () => {
    if (!selectedEvent || !actionType) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (actionType === 'approve') {
        handleStatusChange(selectedEvent.id, 'approved');
      } else if (actionType === 'reject') {
        handleStatusChange(selectedEvent.id, 'rejected', rejectionReason);
      }
      setSelectedEvent(null);
      setActionType('');
      setRejectionReason('');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg font-medium text-green-900 mb-4">
              {actionType === 'approve' ? 'Approve Event' : 'Reject Event'}
            </h3>
            
            <div className="bg-green-50 p-4 rounded-md mb-4">
              <p className="font-medium text-green-900">{selectedEvent.title}</p>
              <p className="text-sm text-green-600">{selectedEvent.organizer}</p>
              <p className="text-sm text-green-600">{selectedEvent.date} at {selectedEvent.location}</p>
            </div>

            {actionType === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="3"
                  required
                  className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
            )}

            {actionType === 'approve' && (
              <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-sm text-green-800">
                  Approving this event will make it visible on the GreenGrow public calendar.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedEvent(null);
                  setActionType('');
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatusUpdateModal = () => {
    const [updateText, setUpdateText] = useState('');
    const [currentReportId, setCurrentReportId] = useState(null);

    if (!currentReportId) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (updateText.trim()) {
        handleStatusUpdate(currentReportId, updateText);
        setUpdateText('');
      }
      setCurrentReportId(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg font-medium text-green-900 mb-4">Add Status Update</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="statusUpdate" className="block text-sm font-medium text-green-700 mb-2">
                  Update Message
                </label>
                <textarea
                  id="statusUpdate"
                  rows="3"
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Crew scheduled for tree planting on 3 June..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCurrentReportId(null)}
                  className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Add Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      if (user === null)
        setCurrentPage('login');
      else
        setCurrentPage('home');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleJoinEvent = (eventId) => {
    const newJoinedEvents = new Set(joinedEvents);
    if (newJoinedEvents.has(eventId)) {
      newJoinedEvents.delete(eventId);
    } else {
      newJoinedEvents.add(eventId);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      // Add notification for event join
      setNotifications(prev => [
        { id: Date.now(), type: 'event', title: `You joined ${events.find(e => e.id === eventId).title}`, time: 'Just now', read: false },
        ...prev
      ]);
    }
    setJoinedEvents(newJoinedEvents);
  };

  const handleShareEvent = (eventId) => {
    alert(`Sharing event ${eventId} via your preferred app!`);
  };

  const previousPage = useRef(null);

  const navigateTo = (page, prevPage = null, role = 'citizen', a = false) => {
    // Protected pages that require authentication
    previousPage.current = prevPage;
    setAuthForm({ ...authForm, role: role });
    setAuthMode(a);

    const protectedPages = ['map', 'my-trees', 'achievements', 'report', 'events', 'home', 'status-tracker', 'admin', 'profile'];

    if (protectedPages.includes(page) && !user) {
      setCurrentPage('login'); // Redirect to login if user is not authenticated
    } else {
      setCurrentPage(page);
    }
  };

  const handlePinClick = (pin) => {
    setSelectedPin(pin);
  };

  const closePinDetails = () => {
    setSelectedPin(null);
  };

  const handleReportSubmit = () => {
    if (reportForm.title && reportForm.category && reportForm.severity) {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowConfirmation(true);
              setTimeout(() => setShowConfirmation(false), 3000);
              setReportForm({ title: '', category: '', severity: '', photo: null });
              setUploadProgress(0);
              // Add notification for report submission
              setNotifications(prev => [
                { 
                  id: Date.now(), 
                  type: 'report', 
                  title: `Report submitted successfully`, 
                  time: 'Just now', 
                  read: false 
                },
                ...prev
              ]);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handlePhotoUpload = (file) => {
    setReportForm({ ...reportForm, photo: file });
    setUploadProgress(0);
  };

  const [authMode, setAuthMode] = useState(false);

  const findUserIndex = () => {
    for (let i = 0; i < users.current.length; i++) {
      if (users.current[i].email === authForm.email) {
        return i;
      }
    }
    return null;
  }

  const handleLogin = () => {
    if (authForm.email && authForm.password) {
      const newUser = {
        name: authForm.name || 'Christopher',
        email: authForm.email,
        role: authForm.role,
        password: authForm.password,
        joinDate: 'Mar 1, 2025',
        eventsJoined: 8,
        treesAdopted: 5,
        reportsSubmitted: 12
      };

      if (authMode) {
        let userIndex = findUserIndex();

        if (userIndex === null) {
          alert("Email not found!");
          return;
        } else {
          if (users.current[userIndex].password !== authForm.password) {
            alert("Incorrect password!");
            return;
          }
        }
      } else {
        if (authForm.name.length === 0 || authForm.name.length > 'Benjamin Thio'.length) {
          alert(`Username should have at least 1 character and at most ${'Benjamin Thio'.length} characters.`);
          return;
        }
        if (!(/^(?=.{1,254}$)[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,63}$/.test(authForm.email))) {
          alert('Invalid email');
          return;
        }
        if (authForm.password.length < 8 || authForm.password.length > 32) {
          alert('The password should have at least 8 characters and at most 32 characters');
          return;
        }
        if (users.current.some(value => value.email === authForm.email)) {
          alert("Email existed, please sign in instead.");
          return;
        }
        users.current.push(newUser);
      }
      setUser(newUser);
      setCurrentPage('home');
      setAuthMode(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('onboarding');
    setCurrentSlide(0);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Adapted currentUser for admin
  const currentUser = user ? {
    id: 1,
    name: user.name,
    role: 'local_authority', // Map 'admin' to 'local_authority'
    department: 'GreenGrow City Management'
  } : null;

  // Render different pages based on current page state
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100 px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {previousPage.current === null ? navigateTo('') : navigateTo(previousPage.current)}}
              className="flex gap-1 items-center text-green-700 hover:text-green-800 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faArrowLeft}/>Back
            </button>
            <h1 className="mr-[3ch] text-xl font-bold text-green-800">Create Account</h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">🌱</div>
                <h2 className="text-2xl font-bold text-green-800">Join GreenGrow</h2>
                <p className="text-green-700">Make a difference in your community</p>
              </div>

              <div className="space-y-4">
                <div>
                  {
                    authMode ?
                    null
                    :
                    <>
                      <label className="block text-sm font-medium text-green-800 mb-2">
                        Full Name
                      </label>
                        <input
                        type="text"
                        value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="text-green-700 w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        maxLength={"Benjamin Thio".length}
                      />    
                    </>
                  }
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="text-green-700 w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Password
                  </label>
                  <div className="text-green-600" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.7rem'}}>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      placeholder="Create a password"
                      className="text-green-600 w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      maxLength={ 32 }
                    />
                    <button onClick={() => {setPasswordVisible(!passwordVisible)}}>
                      <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash}/>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAuthForm({ ...authForm, role: 'citizen' })}
                      className={`py-3 rounded-xl text-sm transition-colors duration-200 ${
                        authForm.role === 'citizen'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      Citizen
                    </button>
                    <button
                      onClick={() => setAuthForm({ ...authForm, role: 'admin' })}
                      className={`py-3 rounded-xl text-sm transition-colors duration-200 ${
                        authForm.role === 'admin'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {authForm.role === 'citizen' 
                      ? 'Join events and report issues' 
                      : 'Organize events and manage reports'}
                  </p>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={!authForm.email || !authForm.password}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors duration-200 mt-4"
                >
                  { authMode ? 'Sign In' : 'Create Account' }
                </button>
                
                {
                  authMode ?
                  null
                  :
                  <div className="text-center text-sm text-green-600 mt-4">
                    Already have an account? <button className="text-green-700 font-medium">Sign in</button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'status-tracker') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100 px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateTo('home')}
              className="flex gap-1 items-center text-green-700 hover:text-green-800 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faArrowLeft}/>Back
            </button>
            <h1 className="text-xl font-bold text-green-800">Status Tracker</h1>
            <button
              onClick={markAllRead}
              className="text-green-600 text-sm hover:text-green-800"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-lg mx-auto space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                  notification.type === 'report' ? 'border-blue-500' :
                  notification.type === 'reminder' ? 'border-yellow-500' :
                  'border-green-500'
                } ${!notification.read ? 'bg-opacity-80' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${!notification.read ? 'text-green-900' : 'text-green-700'}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  )}
                </div>
                <p className="text-green-500 text-sm">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-green-100 px-4 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => navigateTo('home')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'home' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'home' ? '3' : '2') + 'xl' }>🏠</span>
              <span className={ "text-xs font-" + (currentPage == 'home' ? 'bold' : 'medium') }>Home</span>
            </button>
            <button 
              onClick={() => navigateTo('events')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'events' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'events' ? '3' : '2') + 'xl' }>🌱</span>
              <span className={ "text-xs font-" + (currentPage == 'events' ? 'bold' : 'medium') }>Events</span>
            </button>
            <button 
              onClick={() => navigateTo('map')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'map' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'map' ? '3' : '2') + 'xl' }>📍</span>
              <span className={ "text-xs font-" + (currentPage == 'map' ? 'bold' : 'medium') }>Map</span>
            </button>
            <button 
              onClick={() => navigateTo('my-trees')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'my-trees' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'my-trees' ? '3' : '2') + 'xl' }>🌳</span>
              <span className={ "text-xs font-" + (currentPage == 'my-trees' ? 'bold' : 'medium') }>My Trees</span>
            </button>
            <button 
              onClick={() => navigateTo('report')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'report' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'report' ? '3' : '2') + 'xl' }>📝</span>
              <span className={ "text-xs font-" + (currentPage == 'report' ? 'bold' : 'medium') }>Report</span>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'profile' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'profile' ? '3' : '2') + 'xl' }>
                👤
              </span>
              <span className={ "text-xs font-" + (currentPage == 'profile' ? 'bold' : 'medium') }>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-green-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <button
            onClick={() => {navigateTo('home');}}
            className={ 'flex gap-1 items-center text-green-700 hover:text-green-800 transition-colors duration-200' }>
              <FontAwesomeIcon icon={faArrowLeft}/>
              Back
          </button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-green-800">GreenGrow Admin Dashboard</h1>
                <p className="mt-1 text-sm text-green-600">
                  Welcome back, {currentUser.name} • Local Authority Staff
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleExport(activeTab)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export {activeTab === 'events' ? 'Events' : 'Reports'}
                </button>
                
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Navigation Tabs */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="border-b border-green-100">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'events'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-green-500 hover:text-green-700 hover:border-green-300'
                    }`}
                  >
                    Green Events
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reports'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-green-500 hover:text-green-700 hover:border-green-300'
                    }`}
                  >
                    Maintenance Reports
                  </button>
                </nav>
              </div>
            </div>

            {/* Events Tab */}
            {activeTab === 'events' && (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-green-500 truncate">Total Green Events</dt>
                            <dd className="text-lg font-medium text-green-900">{adminEvents.length}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-green-500 truncate">Pending Approval</dt>
                            <dd className="text-lg font-medium text-green-900">{adminEvents.filter(e => e.status === 'pending').length}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-green-500 truncate">Approved Events</dt>
                            <dd className="text-lg font-medium text-green-900">{adminEvents.filter(e => e.status === 'approved').length}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-green-500 truncate">Rejected Events</dt>
                            <dd className="text-lg font-medium text-green-900">{adminEvents.filter(e => e.status === 'rejected').length}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Search</label>
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search events..."
                        className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Organizer Type</label>
                      <select
                        value={filters.organizerType}
                        onChange={(e) => handleFilterChange('organizerType', e.target.value)}
                        className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">All Types</option>
                        <option value="citizen">Citizen</option>
                        <option value="ngo">NGO</option>
                        <option value="school">School</option>
                        <option value="ra">Residents Association</option>
                        <option value="local_authority">Local Authority</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Events Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-green-100">
                    <h2 className="text-lg font-medium text-green-900">
                      Green Events ({filteredEvents.length})
                    </h2>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-green-100">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Organizer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Participants
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-green-100">
                        {filteredEvents.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-green-500">
                              No green events found matching the current criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-green-50">
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-medium text-green-900">{event.title}</div>
                                  <div className="text-sm text-green-500 line-clamp-2">{event.description}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="font-medium text-green-900">{event.organizer}</div>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getOrganizerBadge(event.organizerType)}`}>
                                    {event.organizerType === 'ngo' ? 'NGO' : 
                                     event.organizerType === 'school' ? 'School' : 
                                     event.organizerType === 'ra' ? 'RA' : 
                                     event.organizerType === 'citizen' ? 'Citizen' : 'Local Authority'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                {event.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                {event.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                {event.participants}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(event.status)}`}>
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                                {event.rejectionReason && event.status === 'rejected' && (
                                  <div className="mt-1 text-xs text-red-600 italic">
                                    {event.rejectionReason}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  {currentUser.role === 'local_authority' && event.status === 'pending' ? (
                                    <>
                                      <button
                                        onClick={() => {
                                          setSelectedEvent(event);
                                          setActionType('approve');
                                        }}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedEvent(event);
                                          setActionType('reject');
                                        }}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-green-500">No action needed</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <>
                {/* Filters */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Search</label>
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search reports..."
                        className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Urgency</label>
                      <select
                        value={filters.urgency}
                        onChange={(e) => handleFilterChange('urgency', e.target.value)}
                        className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">All Urgencies</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Status</label>
                      <select
                        value={filters.reportStatus}
                        onChange={(e) => handleFilterChange('reportStatus', e.target.value)}
                        className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="text-green-800 w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedReports.length > 0 && (
                  <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <span className="text-sm text-green-600">
                        {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignDepartment(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="px-3 py-2 border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          defaultValue=""
                        >
                          <option value="">Assign to Department</option>
                          <option value="Maintenance Dept">Maintenance Department</option>
                          <option value="Event Organizer">Event Organizer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reports Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-green-100">
                    <h2 className="text-lg font-medium text-green-900">
                      Maintenance Reports ({filteredReports.length})
                    </h2>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-green-100">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                              onChange={handleSelectAllReports}
                              className="rounded border-green-300 text-green-600 focus:ring-green-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Urgency
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Reporter
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Assigned To
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-green-100">
                        {filteredReports.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="px-6 py-8 text-center text-green-500">
                              No maintenance reports found matching the current criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredReports.map((report) => (
                            <tr key={report.id} className="hover:bg-green-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedReports.includes(report.id)}
                                  onChange={() => handleSelectReport(report.id)}
                                  className="rounded border-green-300 text-green-600 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-medium text-green-900">{report.title}</div>
                                  <div className="text-sm text-green-500 line-clamp-1">{report.description}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <UrgencyBadge urgency={report.urgency} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                {report.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                {report.reporter}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(report.status)}`}>
                                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                {report.assignedTo || 'Unassigned'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => setCurrentReportId(report.id)}
                                  className="text-green-600 hover:text-green-900 mr-4"
                                >
                                  Add Status
                                </button>
                                {statusUpdates[report.id]?.length > 0 && (
                                  <span className="text-xs text-green-500">
                                    {statusUpdates[report.id].length} update{statusUpdates[report.id].length !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Status Updates Panel */}
                {Object.keys(statusUpdates).some(key => statusUpdates[key].length > 0) && (
                  <div className="mt-6 bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-green-900 mb-4">Status Updates</h2>
                    <div className="space-y-4">
                      {Object.entries(statusUpdates).map(([reportId, updates]) => 
                        updates.map(update => {
                          const report = reports.find(r => r.id === parseInt(reportId));
                          return (
                            <div key={update.id} className="border-l-4 border-green-500 pl-4 py-2">
                              <div className="flex justify-between">
                                <span className="font-medium text-green-900">{report?.title}</span>
                                <span className="text-sm text-green-500">{update.timestamp}</span>
                              </div>
                              <p className="text-green-700 mt-1">{update.text}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-green-100 px-4 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => navigateTo('home')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'home' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'home' ? '3' : '2') + 'xl' }>🏠</span>
              <span className={ "text-xs font-" + (currentPage == 'home' ? 'bold' : 'medium') }>Home</span>
            </button>
            <button 
              onClick={() => navigateTo('events')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'events' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'events' ? '3' : '2') + 'xl' }>🌱</span>
              <span className={ "text-xs font-" + (currentPage == 'events' ? 'bold' : 'medium') }>Events</span>
            </button>
            <button 
              onClick={() => navigateTo('map')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'map' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'map' ? '3' : '2') + 'xl' }>📍</span>
              <span className={ "text-xs font-" + (currentPage == 'map' ? 'bold' : 'medium') }>Map</span>
            </button>
            <button 
              onClick={() => navigateTo('my-trees')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'my-trees' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'my-trees' ? '3' : '2') + 'xl' }>🌳</span>
              <span className={ "text-xs font-" + (currentPage == 'my-trees' ? 'bold' : 'medium') }>My Trees</span>
            </button>
            <button 
              onClick={() => navigateTo('report')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'report' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'report' ? '3' : '2') + 'xl' }>📝</span>
              <span className={ "text-xs font-" + (currentPage == 'report' ? 'bold' : 'medium') }>Report</span>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'profile' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'profile' ? '3' : '2') + 'xl' }>
                👤
              </span>
              <span className={ "text-xs font-" + (currentPage == 'profile' ? 'bold' : 'medium') }>
                Profile
              </span>
            </button>
          </div>
        </div>

        {/* Modals */}
        {showCreateModal && <CreateEventModal />}
        {showProposalModal && <CreateEventModal />}
        <ActionModal />
        <StatusUpdateModal />
      </div>
    );
  }

  if (currentPage === 'events') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100 px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateTo('home')}
              className="flex gap-1 items-center text-green-700 hover:text-green-800 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faArrowLeft}/>Back
            </button>
            <h1 className="text-xl font-bold text-green-800" style={{ marginLeft: `${8.5 * user.name.length}px` }}>Events</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateTo('status-tracker')}
                className="text-2xl text-green-700" style={{position: 'relative'}}
              >
                🔔
                {
                  notifications.some(value => !value.read) ? <div style={{position: 'absolute', width: '0.5rem', aspectRatio: 1, borderRadius: '50%', backgroundColor: 'red', right: 0, bottom: '0.1rem'}} /> : null
                }
              </button>
              <button
                className="text-green-700 font-medium"
                onClick={() => navigateTo('profile')}
                >Hi {user ? user.name : 'User'} 👋
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Toast */}
        {showConfirmation && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50">
            Event added to your calendar!
          </div>
        )}

        {/* Events List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-lg mx-auto space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Event Image */}
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                
                {/* Event Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-green-800 mb-2">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-green-700 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 3h12a2 2 0 002-3V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{event.date} – {event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-green-700 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-green-700 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span>{event.volunteers} volunteers joined</span>
                    </div>
                    
                    <div className="flex items-center text-green-700 text-sm">
                      <span>Organized by {event.organizer}</span>
                    </div>
                  </div>
                  
                  {/* Tools */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">Recommended Tools:</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tools.map((tool, index) => (
                        <span 
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      className={`flex-1 py-2 rounded-full font-semibold transition-colors duration-200 ${
                        joinedEvents.has(event.id)
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {joinedEvents.has(event.id) ? 'Cancel' : 'Join'}
                    </button>
                    
                    <button
                      onClick={() => handleShareEvent(event.id)}
                      className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-full hover:bg-green-50 transition-colors duration-200"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-green-100 px-4 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => navigateTo('home')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'home' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'home' ? '3' : '2') + 'xl' }>🏠</span>
              <span className={ "text-xs font-" + (currentPage == 'home' ? 'bold' : 'medium') }>Home</span>
            </button>
            <button 
              onClick={() => navigateTo('events')}
              className={ 'flex gap-2 flex-col items-center text-green-' + (currentPage == 'events' ? '600' : '400') }
            >
              <span 
                className={
                  'mb-2 text-' + (currentPage === 'events' ? '4xl' : '2xl') + 
                  ' transition-all duration-300 ' + 
                  (currentPage === 'events' ? 'scale-150 -mt-5' : '')
                }
              >🌱</span>
              <span className={ "text-xs font-" + (currentPage == 'events' ? 'bold' : 'medium') }>Events</span>
            </button>
            <button 
              onClick={() => navigateTo('map')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'map' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'map' ? '3' : '2') + 'xl' }>📍</span>
              <span className={ "text-xs font-" + (currentPage == 'map' ? 'bold' : 'medium') }>Map</span>
            </button>
            <button 
              onClick={() => navigateTo('my-trees')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'my-trees' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'my-trees' ? '3' : '2') + 'xl' }>🌳</span>
              <span className={ "text-xs font-" + (currentPage == 'my-trees' ? 'bold' : 'medium') }>My Trees</span>
            </button>
            <button 
              onClick={() => navigateTo('report')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'report' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'report' ? '3' : '2') + 'xl' }>📝</span>
              <span className={ "text-xs font-" + (currentPage == 'report' ? 'bold' : 'medium') }>Report</span>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'profile' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'profile' ? '3' : '2') + 'xl' }>
                👤
              </span>
              <span className={ "text-xs font-" + (currentPage == 'profile' ? 'bold' : 'medium') }>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100 px-4 py-5">
          <div className="flex items-center justify-between">
            <h1 onClick={() => navigateTo('')} className="text-2xl font-bold text-green-800">🌿GreenGrow🌿</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateTo('status-tracker')}
                className="text-2xl text-green-700" style={{position: 'relative'}}
              >
                🔔
                {
                  notifications.some(value => !value.read) ? <div style={{position: 'absolute', width: '0.5rem', aspectRatio: 1, borderRadius: '50%', backgroundColor: 'red', right: 0, bottom: '0.1rem'}} /> : null
                }
              </button>
              <button
                className="text-green-700 font-medium"
                onClick={() => navigateTo('profile')}
                >Hi {user ? user.name : 'User'} 👋
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
            {/* Events Button */}
            <button 
              onClick={() => navigateTo('events')}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">🌱</div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Events</h3>
              <p className="text-green-600 text-sm">Browse upcoming events</p>
            </button>

            {/* Map Button */}
            <button 
              onClick={() => navigateTo('map')}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">📍</div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Map</h3>
              <p className="text-green-600 text-sm">View green zones & reports</p>
            </button>

            {/* My Trees Button */}
            <button 
              onClick={() => navigateTo('my-trees')}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">🌳</div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">My Trees</h3>
              <p className="text-green-600 text-sm">Track adopted trees</p>
            </button>

            {/* Report Issue Button */}
            <button 
              onClick={() => navigateTo('report')}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">📝</div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Report Issue</h3>
              <p className="text-green-600 text-sm">Submit green zone problems</p>
            </button>
            <button 
              onClick={() => navigateTo('achievements')}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">🏆</div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Achievements</h3>
              <p className="text-green-600 text-sm">Track your impact, earn badges for tree planting, reporting, and green care.</p>
            </button>
            {
              user && user.role === 'admin'
              ? 
              <button 
                onClick={() => navigateTo('admin')}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">📊</div>
                <h3 className="text-lg font-semibold text-green-800 mb-1">Admin Dashboard</h3>
                <p className="text-green-600 text-sm">Manage reports, create events, and coordinate volunteers.</p>
              </button>
              :
              <button 
                onClick={() => navigateTo('login', 'home', 'admin', true)}
                className="rounded-2xl p-6 border-2 border-dashed border-green-300 hover:border-green-500 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">🔒</div>
                <h3 className="text-lg font-semibold text-green-800 mb-1">Admin Dashboard</h3>
                <p className="text-green-600 text-sm">Login as admin to unlock.</p>
              </button>
            }
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-green-100 px-4 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => navigateTo('home')}
              className={ 'flex gap-2 flex-col items-center text-green-' + (currentPage == 'home' ? '600' : '400') }
            >
              <span 
                className={
                  'mb-2 text-' + (currentPage === 'home' ? '4xl' : '2xl') + 
                  ' transition-all duration-300 ' + 
                  (currentPage === 'home' ? 'scale-150 -mt-5' : '')
                }
              >🏠</span>
              <span className={ "text-xs font-" + (currentPage == 'home' ? 'bold' : 'medium') }>Home</span>
            </button>
            <button 
              onClick={() => navigateTo('events')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'events' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'events' ? '3' : '2') + 'xl' }>🌱</span>
              <span className={ "text-xs font-" + (currentPage == 'events' ? 'bold' : 'medium') }>Events</span>
            </button>
            <button 
              onClick={() => navigateTo('map')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'map' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'map' ? '3' : '2') + 'xl' }>📍</span>
              <span className={ "text-xs font-" + (currentPage == 'map' ? 'bold' : 'medium') }>Map</span>
            </button>
            <button 
              onClick={() => navigateTo('my-trees')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'my-trees' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'my-trees' ? '3' : '2') + 'xl' }>🌳</span>
              <span className={ "text-xs font-" + (currentPage == 'my-trees' ? 'bold' : 'medium') }>My Trees</span>
            </button>
            <button 
              onClick={() => navigateTo('report')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'report' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'report' ? '3' : '2') + 'xl' }>📝</span>
              <span className={ "text-xs font-" + (currentPage == 'report' ? 'bold' : 'medium') }>Report</span>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'profile' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'profile' ? '3' : '2') + 'xl' }>
                👤
              </span>
              <span className={ "text-xs font-" + (currentPage == 'profile' ? 'bold' : 'medium') }>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'report') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100 px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateTo('home')}
              className="flex gap-1 items-center text-green-700 hover:text-green-800 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faArrowLeft}/>Back
            </button>
            <h1 className="text-xl font-bold text-green-800" style={{ marginLeft: `${8.5 * user.name.length}px` }}>Report Issue</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateTo('status-tracker')}
                className="text-2xl text-green-700" style={{position: 'relative'}}
              >
                🔔
                {
                  notifications.some(value => !value.read) ? <div style={{position: 'absolute', width: '0.5rem', aspectRatio: 1, borderRadius: '50%', backgroundColor: 'red', right: 0, bottom: '0.1rem'}} /> : null
                }
              </button>
              <button
                className="text-green-700 font-medium"
                onClick={() => navigateTo('profile')}
                >Hi {user ? user.name : 'User'} 👋
              </button>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Title Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  placeholder="e.g., Fallen tree blocking path"
                  className="text-green-800 w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Category Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  Category
                </label>
                <select
                  value={reportForm.category}
                  onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                  className="text-green-800 w-full px-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="">Select category</option>
                  <option value="tree-health">Tree Health</option>
                  <option value="littering">Littering</option>
                  <option value="facility-damage">Facility Damage</option>
                </select>
              </div>

              {/* Severity Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  Severity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setReportForm({ ...reportForm, severity: level.toLowerCase() })}
                      className={`py-3 rounded-xl font-medium transition-colors duration-200 ${
                        reportForm.severity === level.toLowerCase()
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  Location
                </label>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">📍</div>
                  <p className="text-green-700 text-sm">GPS auto-tagged: Taman Seri Park</p>
                  <button className="text-green-600 text-sm mt-1 hover:underline">
                    Adjust pin manually
                  </button>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-green-800 mb-2">
                  Upload Photo/Video
                </label>
                <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors duration-200">
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-green-600 text-sm mb-3">Tap to upload image or video</p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handlePhotoUpload(e.target.files[0])}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-green-600 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleReportSubmit}
                disabled={!reportForm.title || !reportForm.category || !reportForm.severity || uploadProgress > 0 && uploadProgress < 100}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Toast */}
        {showConfirmation && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50">
            Report submitted. Awaiting acknowledgment.
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-green-100 px-4 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => navigateTo('home')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'home' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'home' ? '3' : '2') + 'xl' }>🏠</span>
              <span className={ "text-xs font-" + (currentPage == 'home' ? 'bold' : 'medium') }>Home</span>
            </button>
            <button 
              onClick={() => navigateTo('events')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'events' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'events' ? '3' : '2') + 'xl' }>🌱</span>
              <span className={ "text-xs font-" + (currentPage == 'events' ? 'bold' : 'medium') }>Events</span>
            </button>
            <button 
              onClick={() => navigateTo('map')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'map' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'map' ? '3' : '2') + 'xl' }>📍</span>
              <span className={ "text-xs font-" + (currentPage == 'map' ? 'bold' : 'medium') }>Map</span>
            </button>
            <button 
              onClick={() => navigateTo('my-trees')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'my-trees' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'my-trees' ? '3' : '2') + 'xl' }>🌳</span>
              <span className={ "text-xs font-" + (currentPage == 'my-trees' ? 'bold' : 'medium') }>My Trees</span>
            </button>
            <button 
              onClick={() => navigateTo('report')}
              className={ 'flex gap-2 flex-col items-center text-green-' + (currentPage == 'report' ? '600' : '400') }
            >
              <span 
                className={
                  'mb-2 text-' + (currentPage === 'report' ? '4xl' : '2xl') + 
                  ' transition-all duration-300 ' + 
                  (currentPage === 'report' ? 'scale-150 -mt-5' : '')
                }
              >📝</span>
              <span className={ "text-xs font-" + (currentPage == 'report' ? 'bold' : 'medium') }>Report</span>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'profile' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'profile' ? '3' : '2') + 'xl' }>
                👤
              </span>
              <span className={ "text-xs font-" + (currentPage == 'profile' ? 'bold' : 'medium') }>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'map') {
      return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {/* Header */}
        <div style={{display: 'flex', flexDirection: 'column', position: 'fixed', right: 0, zIndex: 10, width: '100%'}}>
          <div className="bg-white shadow-sm border-b border-green-100 px-4 py-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateTo('home')}
                className="flex gap-1 items-center text-green-700 hover:text-green-800 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft}/>Back
              </button>
              <h1 className="text-xl font-bold text-green-800" style={{ marginLeft: `${8.5 * user.name.length}px` }}>Map</h1>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigateTo('status-tracker')}
                  className="text-2xl text-green-700" style={{position: 'relative'}}
                >
                  🔔
                  {
                    notifications.some(value => !value.read) ? <div style={{position: 'absolute', width: '0.5rem', aspectRatio: 1, borderRadius: '50%', backgroundColor: 'red', right: 0, bottom: '0.1rem'}} /> : null
                  }
                </button>
                <button
                  className="text-green-700 font-medium"
                  onClick={() => navigateTo('profile')}
                  >Hi {user ? user.name : 'User'} 👋
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white px-4 py-3 border-b border-green-100">
            <div className="flex flex-wrap gap-2">
              {['all', 'events', 'reports'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveMapFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeMapFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'events' ? 'Events' : 'Reports'}
                </button>
              ))}
            </div>
          </div>   
        </div>
          
        <div
          ref={mapContainerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "calc(100vh - (72.79px + 52.8px + 76.79px))",
            marginTop: "calc(72.79px + 52.8px)",
            marginBottom: "76.79px",
            overflow: 'auto',
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <img src={map.src} 
            alt="map"
            style={{
              display: 'block',
              width: 'auto',
              height: 'auto',
              maxWidth: 'none',
              overflow: 'scroll'
            }}
            draggable={false}/>
          {
            mapPins.map((value, index) => {
              // Benjamin Thio
              let pin;

              if (value.type === 'urgent')
                pin = '🔴';
              else if (value.type === 'medium')
                pin = '🟡';
              else if (value.type === 'healthy')
                pin = '🟢';
              else if (value.type === 'event')
                pin = '🔵';
              else
                pin = '🟣';

              if (activeMapFilter === "reports" && value.timeline === undefined) return null;
              else if (activeMapFilter === "events" && value.timeline !== undefined) return null;

              return <div key={index} style={{position: 'absolute', translate: `${value.lat}px ${value.lng}px`, top: 0, userSelect: 'none'}}>
                <div className="hover:scale-[1.3] transition:all duration-200" onClick={() => {
                  const updated = [...visibility];

                  updated[index] = !updated[index];
                  setVisibility(updated); 
                }}>{ pin }</div>
                {
                visibility[index] ?
                <div style={{
                  width: '30ch',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  position: 'absolute',
                  color: 'black',
                  backgroundColor: 'white',
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap',
                  right: '-14ch',
                  top: '1.5rem',
                  overflow: 'hidden'
                  }}>
                  <div onClick={() => {
                      const updated = [...visibility];
                  
                      updated[index] = false;
                      setVisibility(updated); 
                    }} className='bg-green-400 p-6 rounded-xl hover:scale-[1.2] transition-all duration-200' style={{position: 'absolute', right: '-0.5rem', top: '-0.5rem'}}>
                    <FontAwesomeIcon style={{position: 'absolute', bottom: '0.7rem', left: '0.6rem'}} icon={faXmark}/>
                  </div>
                  <div className="flex justify-center mb-2" style={{width: '100%'}}>
                      <div className="flex gap-2 bg-gray-600 w-min p-2 rounded-2xl">
                        {
                          value.type === 'healthy'
                          ?
                          <div style={{
                            background: "#009600",
                            height: "0.5rem",
                            aspectRatio: 1,
                            borderRadius: "50%",
                            boxShadow: "inset 0 0 0.12rem 0.12rem #c8ffc8, 0 0 0.5rem 0.25rem #009600cc"
                          }}/>
                          :
                          <div style={{
                            background: "#000000",
                            height: "0.5rem",
                            aspectRatio: 1,
                            borderRadius: "50%",
                            boxShadow: "inset 0 0 0.12rem 0.12rem #c8c8c8, 0 0 0.5rem 0.25rem #00000000"
                          }}/>
                        }
                        {
                          value.type === 'event'
                          ?
                          <div style={{
                            background: "#001eff",
                            height: "0.5rem",
                            aspectRatio: 1,
                            borderRadius: "50%",
                            boxShadow: "inset 0 0 0.12rem 0.12rem #c8e6ff, 0 0 0.5rem 0.25rem #001effff"
                          }}/>
                          :
                          <div style={{
                            background: "#000000",
                            height: "0.5rem",
                            aspectRatio: 1,
                            borderRadius: "50%",
                            boxShadow: "inset 0 0 0.12rem 0.12rem #c8c8c8, 0 0 0.5rem 0.25rem #00000000"
                          }}/>
                        }
                        {
                          value.type === 'medium'
                          ?
                          <div style={{
                            background: "#ff9600",
                            height: "0.5rem",
                            aspectRatio: 1,
                            borderRadius: "50%",
                            boxShadow: "inset 0 0 0.12rem 0.12rem #ffffc8, 0 0 0.5rem 0.25rem #ff960099"
                          }}/>
                          :
                          <div style={{
                            background: "#000000",
                            height: "0.5rem",
                            aspectRatio: 1,
                            borderRadius: "50%",
                            boxShadow: "inset 0 0 0.12rem 0.12rem #c8c8c8, 0 0 0.5rem 0.25rem #00000000"
                          }}/>
                        }
                        {
                          value.type === 'urgent'
                          ?
                          <div style={{
                            background: "#ff0000",
                            height: "0.5rem",
                            aspectRatio: 1,
                            borderRadius: "50%",
                            boxShadow: "inset 0 0 0.12rem 0.12rem #ffc8c8, 0 0 0.5rem 0.25rem #ff000099"
                          }}/>
                          :
                          <div style={{
                            background: "#000000",
                            height: "0.5rem",
                            aspectRatio: 1,
                            borderRadius: "50%",
                            boxShadow: "inset 0 0 0.12rem 0.12rem #c8c8c8, 0 0 0.5rem 0.25rem #00000000"
                          }}/>
                        }
                      </div>
                    </div>
                  <div className="text-green-700 font-bold">
                    { value.title }
                  </div>
                  <div className="text-green-600 mb-2 pl-0.5 pr-0.5">
                    {
                      `Description: ${value.description}`
                    }
                    <div className="flex gap-2">
                      { `Status: ${ value.type }` }
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-green-700 bg-green-200 w-fit p-1.5 rounded-2xl text-xs pl-2 pr-2">{ value.category }</div>
                    <div className="text-green-600 text-sm">{ value.date }</div>
                  </div>
                </div>
                :
                null
                }
              </div>
            })
          }
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-green-100 px-4 py-3" style={{position: 'fixed', bottom: 0, width: '100svw'}}>
          <div className="flex justify-around">
            <button
              onClick={() => navigateTo('home')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'home' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'home' ? '3' : '2') + 'xl' }>🏠</span>
              <span className={ "text-xs font-" + (currentPage == 'home' ? 'bold' : 'medium') }>Home</span>
            </button>
            <button 
              onClick={() => navigateTo('events')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'events' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'events' ? '3' : '2') + 'xl' }>🌱</span>
              <span className={ "text-xs font-" + (currentPage == 'events' ? 'bold' : 'medium') }>Events</span>
            </button>
            <button 
              onClick={() => navigateTo('map')}
              className={ 'flex gap-2 flex-col items-center text-green-' + (currentPage == 'map' ? '600' : '400') }
            >
              <span 
                className={
                  'mb-2 text-' + (currentPage === 'map' ? '4xl' : '2xl') + 
                  ' transition-all duration-300 ' + 
                  (currentPage === 'map' ? 'scale-150 -mt-5' : '')
                }
              >📍</span>
              <span className={ "text-xs font-" + (currentPage == 'map' ? 'bold' : 'medium') }>Map</span>
            </button>
            <button 
              onClick={() => navigateTo('my-trees')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'my-trees' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'my-trees' ? '3' : '2') + 'xl' }>🌳</span>
              <span className={ "text-xs font-" + (currentPage == 'my-trees' ? 'bold' : 'medium') }>My Trees</span>
            </button>
            <button 
              onClick={() => navigateTo('report')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'report' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'report' ? '3' : '2') + 'xl' }>📝</span>
              <span className={ "text-xs font-" + (currentPage == 'report' ? 'bold' : 'medium') }>Report</span>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'profile' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'profile' ? '3' : '2') + 'xl' }>
                👤
              </span>
              <span className={ "text-xs font-" + (currentPage == 'profile' ? 'bold' : 'medium') }>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

if (currentPage === 'my-trees') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100 px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateTo('home')}
              className="flex gap-1 items-center text-green-700 hover:text-green-800 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faArrowLeft}/>Back
            </button>
            <h1 className="text-xl font-bold text-green-800" style={{ marginLeft: `${8.5 * user.name.length}px` }}>My Trees</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateTo('status-tracker')}
                className="text-2xl text-green-700" style={{position: 'relative'}}
              >
                🔔
                {
                  notifications.some(value => !value.read) ? <div style={{position: 'absolute', width: '0.5rem', aspectRatio: 1, borderRadius: '50%', backgroundColor: 'red', right: 0, bottom: '0.1rem'}} /> : null
                }
              </button>
              <button
                className="text-green-700 font-medium"
                onClick={() => navigateTo('profile')}
                >Hi {user ? user.name : 'User'} 👋
              </button>
            </div>
          </div>
        </div>

        {/* My Trees List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-lg mx-auto space-y-6">
            {myTrees.map((tree) => (
              <div key={tree.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Tree Header */}
                <div className="p-4 border-b border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={tree.photo} 
                        alt={tree.name}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-bold text-green-800">{tree.name}</h3>
                        <p className="text-sm text-green-600">Status: {tree.status}</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-500">{tree.lastUpdate}</span>
                  </div>
                </div>

                {/* Timeline Updates */}
                <div className="p-4">
                  <h4 className="font-semibold text-green-800 mb-3">Progress Timeline</h4>
                  <div className="space-y-4">
                    {tree.updates.map((update, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex flex-col items-center mr-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          {index < tree.updates.length - 1 && (
                            <div className="w-0.5 h-8 bg-green-300"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="bg-green-50 rounded-lg p-3">
                            <img 
                              src={update.photo} 
                              alt="Update"
                              className="w-full h-20 object-cover rounded-lg mb-2"
                            />
                            <p className="text-sm text-green-700">{update.note}</p>
                            <span className="text-xs text-green-500">{update.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="p-4 border-t border-green-100">
                  <button className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 transition-colors duration-200">
                    Upload Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-green-100 px-4 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => navigateTo('home')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'home' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'home' ? '3' : '2') + 'xl' }>🏠</span>
              <span className={ "text-xs font-" + (currentPage == 'home' ? 'bold' : 'medium') }>Home</span>
            </button>
            <button 
              onClick={() => navigateTo('events')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'events' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'events' ? '3' : '2') + 'xl' }>🌱</span>
              <span className={ "text-xs font-" + (currentPage == 'events' ? 'bold' : 'medium') }>Events</span>
            </button>
            <button 
              onClick={() => navigateTo('map')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'map' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'map' ? '3' : '2') + 'xl' }>📍</span>
              <span className={ "text-xs font-" + (currentPage == 'map' ? 'bold' : 'medium') }>Map</span>
            </button>
            <button 
              onClick={() => navigateTo('my-trees')}
              className={ 'flex gap-2 flex-col items-center text-green-' + (currentPage == 'my-trees' ? '600' : '400') }
            >
              <span 
                className={
                  'mb-2 text-' + (currentPage === 'my-trees' ? '4xl' : '2xl') + 
                  ' transition-all duration-300 ' + 
                  (currentPage === 'my-trees' ? 'scale-150 -mt-5' : '')
                }
              >🌳</span>
              <span className={ "text-xs font-" + (currentPage == 'my-trees' ? 'bold' : 'medium') }>My Trees</span>
            </button>
            <button 
              onClick={() => navigateTo('report')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'report' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'report' ? '3' : '2') + 'xl' }>📝</span>
              <span className={ "text-xs font-" + (currentPage == 'report' ? 'bold' : 'medium') }>Report</span>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'profile' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'profile' ? '3' : '2') + 'xl' }>
                👤
              </span>
              <span className={ "text-xs font-" + (currentPage == 'profile' ? 'bold' : 'medium') }>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    );
}

if (currentPage === 'achievements') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100 px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateTo('home')}
              className="flex gap-1 items-center text-green-700 hover:text-green-800 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faArrowLeft}/>Back
            </button>
            <h1 className="text-xl font-bold text-green-800" style={{ marginLeft: `${8.5 * user.name.length}px` }}>Achievements</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateTo('status-tracker')}
                className="text-2xl text-green-700" style={{position: 'relative'}}
              >
                🔔
                {
                  notifications.some(value => !value.read) ? <div style={{position: 'absolute', width: '0.5rem', aspectRatio: 1, borderRadius: '50%', backgroundColor: 'red', right: 0, bottom: '0.1rem'}} /> : null
                }
              </button>
              <button
                className="text-green-700 font-medium"
                onClick={() => navigateTo('profile')}
                >Hi {user ? user.name : 'User'} 👋
              </button>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-lg mx-auto space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-start">
                  <div className="text-4xl mr-4 flex-shrink-0">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-800 mb-1">{achievement.title}</h3>
                    <p className="text-green-600 text-sm mb-3">{achievement.description}</p>
                    
                    {achievement.earned ? (
                      <div className="flex items-center text-green-700 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Earned on {achievement.date}
                      </div>
                    ) : achievement.progress ? (
                      <div>
                        <div className="flex justify-between text-xs text-green-600 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.total}</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-green-400 text-sm">Not yet achieved</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-green-100 px-4 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => navigateTo('home')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'home' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'home' ? '3' : '2') + 'xl' }>🏠</span>
              <span className={ "text-xs font-" + (currentPage == 'home' ? 'bold' : 'medium') }>Home</span>
            </button>
            <button 
              onClick={() => navigateTo('events')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'events' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'events' ? '3' : '2') + 'xl' }>🌱</span>
              <span className={ "text-xs font-" + (currentPage == 'events' ? 'bold' : 'medium') }>Events</span>
            </button>
            <button 
              onClick={() => navigateTo('map')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'map' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'map' ? '3' : '2') + 'xl' }>📍</span>
              <span className={ "text-xs font-" + (currentPage == 'map' ? 'bold' : 'medium') }>Map</span>
            </button>
            <button 
              onClick={() => navigateTo('my-trees')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'my-trees' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'my-trees' ? '3' : '2') + 'xl' }>🌳</span>
              <span className={ "text-xs font-" + (currentPage == 'my-trees' ? 'bold' : 'medium') }>My Trees</span>
            </button>
            <button 
              onClick={() => navigateTo('report')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'report' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'report' ? '3' : '2') + 'xl' }>📝</span>
              <span className={ "text-xs font-" + (currentPage == 'report' ? 'bold' : 'medium') }>Report</span>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'profile' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'profile' ? '3' : '2') + 'xl' }>
                👤
              </span>
              <span className={ "text-xs font-" + (currentPage == 'profile' ? 'bold' : 'medium') }>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    );
}

if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100 px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateTo('home')}
              className="flex gap-1 items-center text-green-700 hover:text-green-800 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faArrowLeft}/>Back
            </button>
            <h1 className="text-xl font-bold text-green-800" style={{ marginLeft: `${8.5 * user.name.length}px` }}>Profile</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateTo('status-tracker')}
                className="text-2xl text-green-700" style={{position: 'relative'}}
              >
                🔔
                {
                  notifications.some(value => !value.read) ? <div style={{position: 'absolute', width: '0.5rem', aspectRatio: 1, borderRadius: '50%', backgroundColor: 'red', right: 0, bottom: '0.1rem'}} /> : null
                }
              </button>
              <button
                className="text-green-700 font-medium"
                onClick={() => navigateTo('profile')}
                >Hi {user ? user.name : 'User'} 👋
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
              <div className="bg-green-600 h-24"></div>
              <div className="p-6 pt-0 -mt-8">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center text-3xl">
                    🌿
                  </div>
                </div>
                <h2 className="text-xl font-bold text-green-800 text-center mb-1">{user.name}</h2>
                <p className="text-green-600 text-center mb-4">Role: {user.role}</p>
                
                <div className="space-y-3 pt-4 border-t border-green-100">
                  <div className="flex justify-between">
                    <span className="text-green-600">Email</span>
                    <span className="text-green-800 font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Member Since</span>
                    <span className="text-green-800 font-medium">{user.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Events Joined</span>
                    <span className="text-green-800 font-medium">{user.eventsJoined}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Trees Adopted</span>
                    <span className="text-green-800 font-medium">{user.treesAdopted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Reports Submitted</span>
                    <span className="text-green-800 font-medium">{user.reportsSubmitted}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-white border-2 border-green-300 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors duration-200">
                Edit Profile
              </button>
              <button className="w-full bg-white border-2 border-green-300 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors duration-200">
                Privacy Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-700 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-green-100 px-4 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => navigateTo('home')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'home' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'home' ? '3' : '2') + 'xl' }>🏠</span>
              <span className={ "text-xs font-" + (currentPage == 'home' ? 'bold' : 'medium') }>Home</span>
            </button>
            <button 
              onClick={() => navigateTo('events')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'events' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'events' ? '3' : '2') + 'xl' }>🌱</span>
              <span className={ "text-xs font-" + (currentPage == 'events' ? 'bold' : 'medium') }>Events</span>
            </button>
            <button 
              onClick={() => navigateTo('map')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'map' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'map' ? '3' : '2') + 'xl' }>📍</span>
              <span className={ "text-xs font-" + (currentPage == 'map' ? 'bold' : 'medium') }>Map</span>
            </button>
            <button 
              onClick={() => navigateTo('my-trees')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'my-trees' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'my-trees' ? '3' : '2') + 'xl' }>🌳</span>
              <span className={ "text-xs font-" + (currentPage == 'my-trees' ? 'bold' : 'medium') }>My Trees</span>
            </button>
            <button 
              onClick={() => navigateTo('report')}
              className={ 'flex flex-col items-center text-green-' + (currentPage == 'report' ? '600' : '400') }
            >
              <span className={ "mb-1 text-" + (currentPage == 'report' ? '3' : '2') + 'xl' }>📝</span>
              <span className={ "text-xs font-" + (currentPage == 'report' ? 'bold' : 'medium') }>Report</span>
            </button>
            <button 
              onClick={() => navigateTo('profile')}
              className={ 'flex gap-2 flex-col items-center text-green-' + (currentPage == 'profile' ? '600' : '400') }
            >
              <span 
                className={
                  'mb-2 text-' + (currentPage === 'profile' ? '4xl' : '2xl') + 
                  ' transition-all duration-300 ' + 
                  (currentPage === 'profile' ? 'scale-150 -mt-5' : '')
                }
              >
                👤
              </span>
              <span className={ "text-xs font-" + (currentPage == 'profile' ? 'bold' : 'medium') }>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    );
}

  // Onboarding Screen
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header/Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-700 mb-2">🌿GreenGrow🌿</h1>
          <p className="text-lg sm:text-xl text-green-600 font-medium">Plant. Protect. Grow.</p>
        </div>

        {/* Onboarding Slides */}
        <div className="w-full max-w-xs sm:max-w-md mb-8">
          <div className="bg-green-50 rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <img 
                src={onboardingSlides[currentSlide].image} 
                alt="Illustration" 
                className="w-36 h-28 sm:w-48 sm:h-36 object-cover rounded-xl shadow-md"
              />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-3 text-center">
              {onboardingSlides[currentSlide].title}
            </h2>
            
            <p className="text-green-700 mb-6 text-center text-sm sm:text-base leading-relaxed">
              {onboardingSlides[currentSlide].description}
            </p>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2 mb-8">
              {onboardingSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-green-600 w-6 sm:w-8' 
                      : 'bg-green-300 hover:bg-green-400'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full font-medium transition-all duration-200 ${
                  currentSlide === 0
                    ? 'text-green-300 cursor-not-allowed'
                    : 'text-green-700 hover:bg-green-100'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={nextSlide}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="w-full max-w-xs sm:max-w-md space-y-3">
          {
            user === null
            ?
            <>
              <button className="w-full bg-white border-2 border-green-500 text-green-700 py-3 rounded-full font-semibold flex items-center justify-center gap-2 sm:gap-3 hover:bg-green-50 transition-colors duration-200 text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
              
              <button className="w-full bg-white border-2 border-blue-600 text-blue-700 py-3 rounded-full font-semibold flex items-center justify-center gap-2 sm:gap-3 hover:bg-blue-50 transition-colors duration-200 text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.983h-1.5c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Sign in with Facebook
              </button>
            </>
            :
            null
          }
          <button 
            onClick={() => {
              setAuthMode(false);
              user === null ? setCurrentPage('login') : setCurrentPage('home');
            }}
            className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
          >
            { user === null ? 'Create Account' : 'Get Started' }
          </button>
          {
             user === null ?
             <button 
              onClick={() => {
                setAuthMode(true);
                user === null ? setCurrentPage('login') : setCurrentPage('home');
              }}
              className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
            >
              Sign In
            </button>
            :
            null
          }
          
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-green-600 text-xs sm:text-sm">
        <p>GreenGrow &copy; 2023 • Connecting communities with nature</p>
      </div>
    </div>
  );
};

export default App;