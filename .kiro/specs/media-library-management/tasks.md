# Implementation Plan: Media Library Management System

## Overview

This implementation plan breaks down the Media Library Management System into discrete coding tasks. The system is built with Next.js 15, TypeScript, React 19, Firebase (Firestore, Storage, Auth), Cloudinary, and Tailwind CSS with shadcn/ui components. Tasks are organized to build incrementally, with early validation through property-based tests and unit tests.

## Tasks

- [ ] 1. Set up project infrastructure and core types
  - Create directory structure for services, repositories, components, and API routes
  - Define TypeScript interfaces for MediaItem, Album, MediaAnalytics, and all input/output types
  - Configure Cloudinary SDK with environment variables and transformation presets
  - Configure Firebase Admin SDK for server-side operations
  - Set up fast-check for property-based testing
  - _Requirements: 13.1, 13.2, 15.1_

- [ ] 2. Implement file validation and metadata extraction
  - [ ] 2.1 Create file validation service with format and size checks
    - Implement validateFile function with file header parsing
    - Add validation for image formats (JPEG, PNG, WebP) and size limit (100MB)
    - Add validation for video formats (MP4, MOV) and size limit (500MB)
    - Add validation for audio formats (MP3, WAV) and size limit (50MB)
    - Add validation for document formats (PDF) and size limit (25MB)
    - Return ValidationResult with descriptive error messages
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 4.8_

  - [ ]* 2.2 Write property test for file size validation
    - **Property 6: File Size Validation Limits**
    - **Validates: Requirements 4.8**

  - [ ] 2.3 Create metadata extraction utilities
    - Extract dimensions (width, height) from images and videos
    - Extract duration from videos and audio files
    - Extract page count from PDF documents
    - _Requirements: 15.7, 15.8_

  - [ ]* 2.4 Write unit tests for file validation edge cases
    - Test boundary conditions for file sizes
    - Test unsupported file formats
    - Test corrupted file headers
    - _Requirements: 15.1, 15.6_

- [ ] 3. Implement Cloudinary upload service
  - [ ] 3.1 Create UploadService with Cloudinary integration
    - Implement uploadToCloudinary function with folder routing by file type
    - Generate thumbnail transformations (400x300, 800x600, 1200x900)
    - Generate video thumbnail transformations
    - Return CloudinaryResult with all URLs and metadata
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ] 3.2 Add retry logic for failed uploads
    - Implement retryUpload with exponential backoff (3 attempts)
    - Handle Cloudinary service errors gracefully
    - _Requirements: 13.7, 17.3_

  - [ ]* 3.3 Write property test for Cloudinary upload persistence
    - **Property 40: Cloudinary Upload Persistence**
    - **Validates: Requirements 13.1, 13.2**

  - [ ]* 3.4 Write unit tests for upload error handling
    - Test retry logic with mock failures
    - Test error message formatting
    - _Requirements: 13.7, 17.1_


- [ ] 4. Implement Firestore repositories
  - [ ] 4.1 Create MediaRepository for media metadata operations
    - Implement createMedia, getMediaById, getMediaList with filters
    - Implement updateMedia, deleteMedia, bulkDeleteMedia
    - Add Firestore query building with pagination support
    - Create composite indexes for efficient queries
    - _Requirements: 4.4, 5.3, 9.2, 12.1_

  - [ ] 4.2 Create AlbumRepository for album operations
    - Implement createAlbum, getAlbumById, getAlbumList
    - Implement updateAlbum, deleteAlbum, addMediaToAlbum, removeMediaFromAlbum
    - _Requirements: 6.3, 6.7_

  - [ ] 4.3 Create AnalyticsRepository for analytics tracking
    - Implement trackView, trackDownload, trackShare
    - Implement getMediaAnalytics, getTopMedia, getDashboardMetrics
    - Use subcollections for detailed event tracking
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 4.4 Write property test for metadata update audit trail
    - **Property 14: Metadata Update Audit Trail**
    - **Validates: Requirements 5.7**

  - [ ]* 4.5 Write unit tests for repository operations
    - Test CRUD operations with Firebase emulator
    - Test query filtering and pagination
    - Test error handling for missing documents
    - _Requirements: 4.4, 5.3, 9.2_

- [ ] 5. Implement MediaService with business logic
  - [ ] 5.1 Create MediaService with CRUD operations
    - Implement createMedia combining upload and metadata storage
    - Implement getMediaById with role-based filtering
    - Implement getMediaList with filters (category, tags, date range, approval status)
    - Implement updateMedia with validation
    - Implement approveMedia and rejectMedia for approval workflow
    - Implement archiveMedia and deleteMedia
    - Implement bulkDeleteMedia with batch processing
    - _Requirements: 4.4, 5.1, 5.2, 7.4, 7.5, 9.1, 9.2, 9.4, 9.5, 9.6_

  - [ ]* 5.2 Write property test for title validation
    - **Property 12: Title Validation Constraints**
    - **Validates: Requirements 5.4**

  - [ ]* 5.3 Write property test for description validation
    - **Property 13: Description Length Validation**
    - **Validates: Requirements 5.5**

  - [ ]* 5.4 Write property test for category enumeration
    - **Property 16: Category Enumeration Constraint**
    - **Validates: Requirements 6.1**

  - [ ]* 5.5 Write property test for upload metadata persistence
    - **Property 11: Upload Metadata Persistence**
    - **Validates: Requirements 4.4**

  - [ ]* 5.6 Write unit tests for MediaService operations
    - Test createMedia workflow end-to-end
    - Test approval workflow state transitions
    - Test bulk deletion with partial failures
    - _Requirements: 4.4, 7.4, 7.5, 9.6_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement SearchService with indexing
  - [ ] 7.1 Create SearchService with full-text search
    - Implement searchMedia with query parsing
    - Build Firestore queries with compound filters (category, tags, date range, text)
    - Implement search index maintenance (titleLower, descriptionLower, tagsLower, searchText)
    - Implement relevance ranking (title > description > tags)
    - Limit results to 1000 items
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 16.1, 16.2, 16.5, 16.6, 16.7_

  - [ ]* 7.2 Write property test for search query matching
    - **Property 1: Search Query Matching**
    - **Validates: Requirements 1.3, 3.1, 3.6**

  - [ ]* 7.3 Write property test for category filter exclusivity
    - **Property 3: Category Filter Exclusivity**
    - **Validates: Requirements 1.2**

  - [ ]* 7.4 Write property test for multiple filter conjunction
    - **Property 4: Multiple Filter Conjunction**
    - **Validates: Requirements 3.3**

  - [ ]* 7.5 Write property test for search result limit
    - **Property 55: Search Result Limit**
    - **Validates: Requirements 16.7**

  - [ ]* 7.6 Write unit tests for search functionality
    - Test partial text matching
    - Test compound queries
    - Test relevance ranking order
    - _Requirements: 3.6, 16.5, 16.6_

- [ ] 8. Implement AnalyticsService
  - [ ] 8.1 Create AnalyticsService with tracking methods
    - Implement trackView with view count increment
    - Implement trackDownload with download count increment
    - Implement trackShare with share count increment
    - Implement getMediaAnalytics for individual media
    - Implement getTopMedia with date range filtering
    - Implement getDashboardMetrics with aggregated stats
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 8.2 Write property test for view count increment
    - **Property 8: View Count Increment**
    - **Validates: Requirements 2.7, 10.2**

  - [ ]* 8.3 Write property test for download count increment
    - **Property 9: Download Count Increment**
    - **Validates: Requirements 10.3**

  - [ ]* 8.4 Write property test for share count increment
    - **Property 10: Share Count Increment**
    - **Validates: Requirements 10.4**

  - [ ]* 8.5 Write property test for top media ranking
    - **Property 35: Top Media Ranking**
    - **Validates: Requirements 10.6**

  - [ ]* 8.6 Write unit tests for analytics tracking
    - Test analytics persistence in Firestore
    - Test dashboard metrics aggregation
    - _Requirements: 10.1, 10.5, 10.6_


- [ ] 9. Implement role-based access control middleware
  - [ ] 9.1 Create auth middleware for API routes
    - Verify Firebase authentication token
    - Extract user ID and role from token
    - Implement checkPermission function for operation-based authorization
    - Add role verification for client and server side
    - _Requirements: 8.1, 8.7_

  - [ ] 9.2 Implement permission checks for each role
    - Public: read approved media only
    - Member: read approved media, submit media (pending approval)
    - Media_team: read all, upload (auto-approved), edit metadata, create albums
    - Admin: full access including approve, reject, delete, archive, analytics
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

  - [ ]* 9.3 Write property test for unauthorized access denial
    - **Property 15: Unauthorized Access Denial**
    - **Validates: Requirements 8.6, 17.4**

  - [ ]* 9.4 Write property test for member upload pending status
    - **Property 20: Member Upload Pending Status**
    - **Validates: Requirements 7.1**

  - [ ]* 9.5 Write property test for privileged user auto-approval
    - **Property 24: Privileged User Auto-Approval**
    - **Validates: Requirements 7.7**

  - [ ]* 9.6 Write property test for public user access restriction
    - **Property 25: Public User Access Restriction**
    - **Validates: Requirements 8.2**

  - [ ]* 9.7 Write property test for admin full access
    - **Property 28: Admin Full Access**
    - **Validates: Requirements 8.5**

  - [ ]* 9.8 Write unit tests for RBAC middleware
    - Test each role's permissions
    - Test access denied responses
    - Test token verification
    - _Requirements: 8.1, 8.6, 8.7_

- [ ] 10. Implement API routes for media operations
  - [ ] 10.1 Create GET /api/media route
    - Accept query parameters: category, tags, search, page, limit, dateFrom, dateTo
    - Apply role-based filtering (public sees approved only)
    - Return paginated media items
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 8.2_

  - [ ] 10.2 Create GET /api/media/[id] route
    - Return single media item with full metadata
    - Apply role-based access control
    - _Requirements: 2.5_

  - [ ] 10.3 Create POST /api/media route
    - Accept multipart/form-data with file and metadata
    - Validate file and metadata
    - Upload to Cloudinary
    - Store metadata in Firestore
    - Set approval status based on user role
    - _Requirements: 4.1, 4.3, 4.4, 7.1, 7.7_

  - [ ] 10.4 Create PATCH /api/media/[id] route
    - Accept updated metadata fields
    - Validate changes
    - Update Firestore with audit trail
    - _Requirements: 5.1, 5.2, 5.3, 5.7_

  - [ ] 10.5 Create DELETE /api/media/[id] route
    - Verify admin role
    - Delete from Firestore and Cloudinary
    - _Requirements: 9.1, 9.2, 9.3, 9.7_

  - [ ] 10.6 Create POST /api/media/bulk-delete route
    - Accept array of media IDs (up to 100)
    - Process deletions with error handling
    - Return success/failure results
    - _Requirements: 9.6_

  - [ ]* 10.7 Write property test for pagination size constraint
    - **Property 2: Pagination Size Constraint**
    - **Validates: Requirements 1.4, 12.1**

  - [ ]* 10.8 Write property test for bulk deletion capacity
    - **Property 33: Bulk Deletion Capacity**
    - **Validates: Requirements 9.6**

  - [ ]* 10.9 Write unit tests for API routes
    - Test request validation
    - Test error responses
    - Test authentication/authorization
    - _Requirements: 4.6, 5.4, 5.5, 8.6_

- [ ] 11. Implement API routes for upload operations
  - [ ] 11.1 Create POST /api/media/upload route
    - Accept single file upload
    - Validate file type and size
    - Upload to Cloudinary with retry logic
    - Create Firestore metadata record
    - _Requirements: 4.1, 4.3, 4.4, 4.7, 4.8_

  - [ ] 11.2 Create POST /api/media/bulk-upload route
    - Accept up to 50 files
    - Process uploads in parallel with progress tracking
    - Return array of results with individual success/failure status
    - _Requirements: 4.2_

  - [ ]* 11.3 Write property test for bulk upload capacity constraint
    - **Property 7: Bulk Upload Capacity Constraint**
    - **Validates: Requirements 4.2**

  - [ ]* 11.4 Write unit tests for upload routes
    - Test file validation errors
    - Test upload progress tracking
    - Test partial bulk upload failures
    - _Requirements: 4.6, 4.8, 17.1_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement API routes for approval workflow
  - [ ] 13.1 Create PATCH /api/media/[id]/approve route
    - Verify admin role
    - Update approval status to "approved"
    - Record approver ID and timestamp
    - Trigger notification to uploader
    - _Requirements: 7.3, 7.4, 7.6_

  - [ ] 13.2 Create PATCH /api/media/[id]/reject route
    - Verify admin role
    - Update approval status to "rejected"
    - Store optional rejection reason
    - Record approver ID and timestamp
    - Trigger notification to uploader
    - _Requirements: 7.3, 7.5, 7.6_

  - [ ] 13.3 Create GET /api/media/pending route
    - Verify admin role
    - Return list of media items with "pending" status
    - _Requirements: 7.2_

  - [ ]* 13.4 Write property test for admin approval status transition
    - **Property 21: Admin Approval Status Transition**
    - **Validates: Requirements 7.4**

  - [ ]* 13.5 Write property test for admin rejection status transition
    - **Property 22: Admin Rejection Status Transition**
    - **Validates: Requirements 7.5**

  - [ ]* 13.6 Write property test for approval notification trigger
    - **Property 23: Approval Notification Trigger**
    - **Validates: Requirements 7.6**

  - [ ]* 13.7 Write unit tests for approval workflow
    - Test approval state transitions
    - Test notification triggering
    - Test rejection reason storage
    - _Requirements: 7.4, 7.5, 7.6_


- [ ] 14. Implement API routes for album operations
  - [ ] 14.1 Create GET /api/albums route
    - Return list of all albums
    - Public access allowed
    - _Requirements: 6.6_

  - [ ] 14.2 Create GET /api/albums/[id] route
    - Return album with associated media items
    - Query media items by albumIds array
    - _Requirements: 6.7_

  - [ ] 14.3 Create POST /api/albums route
    - Verify media_team or admin role
    - Create album with name and description
    - Store in Firestore with metadata
    - _Requirements: 6.2, 6.3_

  - [ ] 14.4 Create PATCH /api/albums/[id] route
    - Verify media_team or admin role
    - Update album fields
    - _Requirements: 6.2_

  - [ ] 14.5 Create POST /api/albums/[id]/media route
    - Verify media_team or admin role
    - Add media IDs to album's mediaIds array
    - Update media items' albumIds arrays
    - _Requirements: 6.4, 6.5_

  - [ ] 14.6 Create DELETE /api/albums/[id]/media/[mediaId] route
    - Verify media_team or admin role
    - Remove media ID from album
    - Update media item's albumIds array
    - _Requirements: 6.4_

  - [ ]* 14.7 Write property test for album creation persistence
    - **Property 17: Album Creation Persistence**
    - **Validates: Requirements 6.3**

  - [ ]* 14.8 Write property test for multi-album membership
    - **Property 18: Multi-Album Membership**
    - **Validates: Requirements 6.5**

  - [ ]* 14.9 Write property test for album content retrieval
    - **Property 19: Album Content Retrieval**
    - **Validates: Requirements 6.7**

  - [ ]* 14.10 Write unit tests for album operations
    - Test album CRUD operations
    - Test media addition/removal
    - Test multi-album membership
    - _Requirements: 6.3, 6.4, 6.5, 6.7_

- [ ] 15. Implement API routes for analytics
  - [ ] 15.1 Create POST /api/analytics/view route
    - Accept media ID
    - Increment view count
    - Record view event in subcollection
    - Public access allowed
    - _Requirements: 2.7, 10.2_

  - [ ] 15.2 Create POST /api/analytics/download route
    - Accept media ID
    - Increment download count
    - Record download event
    - Public access allowed
    - _Requirements: 10.3_

  - [ ] 15.3 Create POST /api/analytics/share route
    - Accept media ID and platform
    - Increment share count
    - Record share event with platform
    - Public access allowed
    - _Requirements: 10.4_

  - [ ] 15.4 Create GET /api/analytics/media/[id] route
    - Verify admin role
    - Return analytics data for specific media
    - _Requirements: 10.5_

  - [ ] 15.5 Create GET /api/analytics/dashboard route
    - Verify admin role
    - Accept dateFrom and dateTo query parameters
    - Return aggregated metrics and top media
    - _Requirements: 10.6_

  - [ ]* 15.6 Write unit tests for analytics API routes
    - Test counter increments
    - Test event recording
    - Test dashboard aggregation
    - _Requirements: 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 16. Implement API routes for search
  - [ ] 16.1 Create GET /api/search route
    - Accept query parameters: q, category, tags, dateFrom, dateTo, page, limit
    - Execute full-text search with filters
    - Apply role-based filtering
    - Return paginated results with relevance ranking
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 16.6_

  - [ ]* 16.2 Write property test for search result relevance ranking
    - **Property 54: Search Result Relevance Ranking**
    - **Validates: Requirements 16.6**

  - [ ]* 16.3 Write property test for compound query support
    - **Property 53: Compound Query Support**
    - **Validates: Requirements 16.5**

  - [ ]* 16.4 Write unit tests for search API
    - Test query parsing
    - Test filter combinations
    - Test result ordering
    - _Requirements: 3.1, 3.3, 3.4, 16.5_

- [ ] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Implement public gallery components
  - [ ] 18.1 Create MediaGallery page component (/app/media/page.tsx)
    - Set up state for search, filters, and pagination
    - Subscribe to Firestore for real-time updates
    - Render SearchBar, FilterPanel, and MediaGrid
    - Implement pagination controls
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 11.1, 11.2_

  - [ ] 18.2 Create MediaGrid component
    - Responsive grid layout (1/2/3/4 columns based on breakpoint)
    - Lazy loading for below-the-fold items
    - Handle click events to open MediaViewer
    - _Requirements: 1.1, 12.5, 14.1, 14.2, 14.3_

  - [ ] 18.3 Create MediaCard component
    - Display thumbnail using Cloudinary URL
    - Show title, category badge, date, views
    - Optimize image loading with Cloudinary transformations
    - _Requirements: 1.1, 12.4, 13.3_

  - [ ] 18.4 Create SearchBar component
    - Text input with debounced search (300ms)
    - Clear button
    - Search suggestions (optional)
    - _Requirements: 1.3, 3.1_

  - [ ] 18.5 Create FilterPanel component
    - Category filter with checkboxes
    - Date range picker
    - Tag filter with autocomplete
    - Active filters display with remove buttons
    - _Requirements: 1.2, 3.2, 3.3_

  - [ ]* 18.6 Write unit tests for gallery components
    - Test MediaCard rendering
    - Test SearchBar debouncing
    - Test FilterPanel state management
    - _Requirements: 1.1, 1.2, 1.3_


- [ ] 19. Implement media viewer components
  - [ ] 19.1 Create MediaViewer modal component
    - Modal overlay with close button
    - Display full metadata (title, description, date, tags)
    - Share and download action buttons
    - Navigation to previous/next media
    - Track view analytics on open
    - _Requirements: 1.5, 2.5, 2.6, 2.7_

  - [ ] 19.2 Create ImageViewer component
    - Lightbox with zoom controls
    - Pan and zoom gestures on mobile
    - High-resolution image loading
    - _Requirements: 2.1_

  - [ ] 19.3 Create VideoPlayer component
    - HTML5 video player with custom controls
    - Play, pause, volume, fullscreen controls
    - Progress bar with seek
    - Playback speed control
    - _Requirements: 2.2_

  - [ ] 19.4 Create AudioPlayer component
    - Audio player with waveform visualization (optional)
    - Play, pause, volume controls
    - Progress bar with seek
    - _Requirements: 2.3_

  - [ ] 19.5 Create DocumentViewer component
    - Display document metadata
    - Download button
    - _Requirements: 2.4_

  - [ ]* 19.6 Write property test for media viewer metadata display
    - **Property 5: Media Viewer Metadata Display**
    - **Validates: Requirements 2.5**

  - [ ]* 19.7 Write unit tests for viewer components
    - Test ImageViewer zoom functionality
    - Test VideoPlayer controls
    - Test AudioPlayer controls
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 20. Implement admin dashboard components
  - [ ] 20.1 Create AdminMediaDashboard page (/app/admin/media/page.tsx)
    - Tabs for: All Media, Pending Approval, Analytics
    - Bulk action toolbar
    - Infinite scroll media list
    - Subscribe to Firestore for real-time updates
    - _Requirements: 7.2, 10.5, 11.3, 11.4, 12.7_

  - [ ] 20.2 Create MediaUploader component
    - Drag-and-drop zone with file selection button
    - Upload progress indicators with percentage
    - Bulk upload support (up to 50 files)
    - Error handling with retry option
    - _Requirements: 4.1, 4.2, 4.5, 4.6, 17.1_

  - [ ] 20.3 Create MediaEditor component
    - Form for editing metadata (title, description, category, tags, date)
    - Album assignment dropdown
    - Real-time validation with error messages
    - Save and cancel actions
    - Tag autocomplete suggestions
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6_

  - [ ] 20.4 Create ApprovalQueue component
    - List of pending media items with thumbnails
    - Approve/reject buttons
    - Rejection reason input
    - Batch approval support
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

  - [ ] 20.5 Create MediaAnalytics component
    - Dashboard with key metrics cards
    - Top 10 most viewed media list (last 30 days)
    - Charts for views, downloads, shares over time
    - Per-media analytics detail view
    - _Requirements: 10.5, 10.6_

  - [ ] 20.6 Create AlbumManager component
    - Create/edit/delete albums
    - Drag-and-drop media into albums
    - Album preview and media reordering
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ]* 20.7 Write unit tests for admin components
    - Test MediaUploader drag-and-drop
    - Test MediaEditor validation
    - Test ApprovalQueue actions
    - _Requirements: 4.1, 5.4, 5.5, 7.3_

- [ ] 21. Implement real-time synchronization
  - [ ] 21.1 Add Firestore listeners to MediaGallery
    - Subscribe to approved media changes
    - Update gallery automatically on new approvals
    - Handle connection status
    - _Requirements: 11.1, 11.2, 11.5_

  - [ ] 21.2 Add Firestore listeners to AdminMediaDashboard
    - Subscribe to all media changes
    - Update dashboard within 2 seconds of changes
    - Handle connection status
    - _Requirements: 11.3, 11.4, 11.5_

  - [ ] 21.3 Add connection status indicator
    - Display indicator when Firestore connection is lost
    - Show reconnection status
    - _Requirements: 11.6_

  - [ ]* 21.4 Write property test for real-time approval update
    - **Property 36: Real-Time Approval Update**
    - **Validates: Requirements 11.2**

  - [ ]* 21.5 Write property test for admin dashboard real-time sync
    - **Property 37: Admin Dashboard Real-Time Sync**
    - **Validates: Requirements 11.4**

  - [ ]* 21.6 Write integration tests for real-time updates
    - Test listener subscription and unsubscription
    - Test automatic UI updates
    - Test connection loss handling
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6_

- [ ] 22. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 23. Implement performance optimizations
  - [ ] 23.1 Add React Query for data fetching and caching
    - Configure cache time (5 minutes for metadata queries)
    - Implement query invalidation on mutations
    - Add optimistic updates for better UX
    - _Requirements: 12.6_

  - [ ] 23.2 Implement lazy loading for media thumbnails
    - Use Intersection Observer for below-the-fold images
    - Load images as they enter viewport
    - _Requirements: 12.5_

  - [ ] 23.3 Optimize Cloudinary image delivery
    - Use transformation URLs for all thumbnails (400x300)
    - Enable automatic format and quality optimization
    - Implement responsive images with srcset
    - _Requirements: 12.4, 13.3, 13.6, 14.6_

  - [ ] 23.4 Add pagination and infinite scroll
    - Implement cursor-based pagination for Firestore queries
    - Add infinite scroll to admin dashboard
    - Ensure first page loads within 2 seconds
    - _Requirements: 12.1, 12.2, 12.3, 12.7_

  - [ ]* 23.5 Write property test for Cloudinary thumbnail transformation
    - **Property 38: Cloudinary Thumbnail Transformation**
    - **Validates: Requirements 12.4**

  - [ ]* 23.6 Write property test for metadata query caching
    - **Property 39: Metadata Query Caching**
    - **Validates: Requirements 12.6**

  - [ ]* 23.7 Write performance tests
    - Test first page load time
    - Test pagination load time
    - Test search performance with 10,000 items
    - _Requirements: 12.2, 12.3, 3.4_


- [ ] 24. Implement mobile responsiveness
  - [ ] 24.1 Add responsive grid layouts
    - 1 column for screens < 640px
    - 2 columns for screens 640px-1024px
    - 3-4 columns for screens > 1024px
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ] 24.2 Optimize MediaViewer for mobile
    - Touch gestures for swipe navigation
    - Touch-optimized controls
    - Responsive modal sizing
    - _Requirements: 14.4, 14.7_

  - [ ] 24.3 Create mobile-optimized admin dashboard
    - Responsive layout for screens < 768px
    - Touch-friendly buttons and controls
    - Collapsible filter panels
    - _Requirements: 14.5_

  - [ ] 24.4 Implement responsive images
    - Use srcset for different screen resolutions
    - Serve appropriate image sizes based on viewport
    - _Requirements: 14.6_

  - [ ]* 24.5 Write responsive design tests
    - Test layouts at different breakpoints
    - Test touch gesture handling
    - Test mobile navigation
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 25. Implement dark mode support
  - [ ] 25.1 Add dark mode detection and toggle
    - Detect system dark mode preference
    - Provide manual toggle button
    - Persist preference to local storage
    - _Requirements: 18.1, 18.5, 18.6_

  - [ ] 25.2 Apply dark mode styles to public gallery
    - Dark background colors and light text
    - Update MediaCard, SearchBar, FilterPanel styles
    - Ensure WCAG AA contrast ratios
    - _Requirements: 18.2, 18.7_

  - [ ] 25.3 Apply dark mode styles to admin dashboard
    - Dark background colors and light text
    - Update all admin component styles
    - Ensure WCAG AA contrast ratios
    - _Requirements: 18.3, 18.7_

  - [ ] 25.4 Apply dark mode styles to media viewer
    - Dark overlay and controls
    - Ensure readability of metadata
    - _Requirements: 18.4_

  - [ ]* 25.5 Write property test for dark mode preference persistence
    - **Property 58: Dark Mode Preference Persistence**
    - **Validates: Requirements 18.6**

  - [ ]* 25.6 Write unit tests for dark mode
    - Test system preference detection
    - Test manual toggle
    - Test local storage persistence
    - _Requirements: 18.1, 18.5, 18.6_

- [ ] 26. Implement error handling and user feedback
  - [ ] 26.1 Create error handler middleware for API routes
    - Categorize errors (validation, auth, authorization, not found, service, rate limit, server)
    - Return appropriate HTTP status codes
    - Log errors to centralized tracking service
    - _Requirements: 17.7_

  - [ ] 26.2 Create error boundary components
    - Wrap gallery and admin dashboard in error boundaries
    - Display fallback UI on errors
    - Log client-side errors
    - _Requirements: 17.2, 17.3_

  - [ ] 26.3 Add toast notification system
    - Success toasts (green, 3s duration)
    - Error toasts (red, 5s duration, dismissible)
    - Warning toasts (yellow, 4s duration)
    - Info toasts (blue, 3s duration)
    - _Requirements: 17.6_

  - [ ] 26.4 Add loading states
    - Upload progress bars with percentage
    - Skeleton screens for content loading
    - Button spinners for actions
    - Infinite scroll loading indicator
    - _Requirements: 4.5, 17.5_

  - [ ] 26.5 Add error modals for critical errors
    - Service unavailable modal with retry button
    - Access denied modal with explanation
    - Generic error modal with error ID
    - _Requirements: 17.2, 17.3, 17.4_

  - [ ] 26.6 Add inline form validation
    - Real-time validation with debouncing
    - Error text below invalid fields
    - Prevent submission with invalid data
    - _Requirements: 5.4, 5.5, 17.1_

  - [ ]* 26.7 Write property test for upload failure error message
    - **Property 56: Upload Failure Error Message**
    - **Validates: Requirements 17.1**

  - [ ]* 26.8 Write property test for validation failure error response
    - **Property 50: Validation Failure Error Response**
    - **Validates: Requirements 15.6**

  - [ ]* 26.9 Write property test for error logging
    - **Property 57: Error Logging**
    - **Validates: Requirements 17.7**

  - [ ]* 26.10 Write unit tests for error handling
    - Test error categorization
    - Test error responses
    - Test toast notifications
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.6_

- [ ] 27. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 28. Implement remaining property tests
  - [ ]* 28.1 Write property test for image thumbnail generation
    - **Property 41: Image Thumbnail Generation**
    - **Validates: Requirements 13.3**

  - [ ]* 28.2 Write property test for video thumbnail generation
    - **Property 42: Video Thumbnail Generation**
    - **Validates: Requirements 13.4**

  - [ ]* 28.3 Write property test for Cloudinary CDN URL usage
    - **Property 43: Cloudinary CDN URL Usage**
    - **Validates: Requirements 13.5**

  - [ ]* 28.4 Write property test for Cloudinary upload retry logic
    - **Property 44: Cloudinary Upload Retry Logic**
    - **Validates: Requirements 13.7**

  - [ ]* 28.5 Write property test for file header validation
    - **Property 45: File Header Validation**
    - **Validates: Requirements 15.1**

  - [ ]* 28.6 Write property test for image format validation
    - **Property 46: Image Format Validation**
    - **Validates: Requirements 15.2**

  - [ ]* 28.7 Write property test for video format validation
    - **Property 47: Video Format Validation**
    - **Validates: Requirements 15.3**

  - [ ]* 28.8 Write property test for audio format validation
    - **Property 48: Audio Format Validation**
    - **Validates: Requirements 15.4**

  - [ ]* 28.9 Write property test for document format validation
    - **Property 49: Document Format Validation**
    - **Validates: Requirements 15.5**

  - [ ]* 28.10 Write property test for file metadata extraction
    - **Property 51: File Metadata Extraction**
    - **Validates: Requirements 15.7, 15.8**

  - [ ]* 28.11 Write property test for search index maintenance
    - **Property 52: Search Index Maintenance**
    - **Validates: Requirements 16.1, 16.2**

  - [ ]* 28.12 Write property test for metadata deletion on media delete
    - **Property 30: Metadata Deletion on Media Delete**
    - **Validates: Requirements 9.2**

  - [ ]* 28.13 Write property test for Cloudinary file deletion on media delete
    - **Property 31: Cloudinary File Deletion on Media Delete**
    - **Validates: Requirements 9.3**

  - [ ]* 28.14 Write property test for archive status visibility
    - **Property 32: Archive Status Visibility**
    - **Validates: Requirements 9.5**

  - [ ]* 28.15 Write property test for admin deletion permission
    - **Property 34: Admin Deletion Permission**
    - **Validates: Requirements 9.7**

  - [ ]* 28.16 Write property test for member submission permission
    - **Property 26: Member Submission Permission**
    - **Validates: Requirements 8.3**

  - [ ]* 28.17 Write property test for media team dashboard access
    - **Property 27: Media Team Dashboard Access**
    - **Validates: Requirements 8.4**

  - [ ]* 28.18 Write property test for client and server role verification
    - **Property 29: Client and Server Role Verification**
    - **Validates: Requirements 8.7**


- [ ] 29. Create Firestore security rules
  - [ ] 29.1 Write security rules for media_items collection
    - Public users can read approved media only
    - Members can create media (pending status)
    - Media team and admins can read/write all media
    - Admins can delete media
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

  - [ ] 29.2 Write security rules for albums collection
    - Public users can read albums
    - Media team and admins can create/update/delete albums
    - _Requirements: 6.2, 6.3, 8.4, 8.5_

  - [ ] 29.3 Write security rules for media_analytics collection
    - Public users can increment counters
    - Admins can read analytics data
    - _Requirements: 10.1, 10.5_

  - [ ]* 29.4 Write unit tests for security rules
    - Test each role's read/write permissions
    - Test unauthorized access denial
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [ ] 30. Create Firestore indexes
  - [ ] 30.1 Define composite indexes in firestore.indexes.json
    - Media list query: approvalStatus (ASC), uploadedAt (DESC)
    - Category filter: approvalStatus (ASC), category (ASC), uploadedAt (DESC)
    - Search with category: approvalStatus (ASC), category (ASC), searchText (ASC), uploadedAt (DESC)
    - Date range query: approvalStatus (ASC), uploadedAt (ASC), uploadedAt (DESC)
    - Album media query: albumIds (ARRAY_CONTAINS), approvalStatus (ASC), uploadedAt (DESC)
    - Pending approval queue: approvalStatus (ASC), uploadedAt (ASC)
    - _Requirements: 1.2, 1.4, 3.3, 7.2, 16.3, 16.4, 16.5_

  - [ ] 30.2 Deploy indexes to Firebase
    - Run firebase deploy --only firestore:indexes
    - Verify index creation in Firebase console
    - _Requirements: 3.4, 12.1_

- [ ] 31. Integration and wiring
  - [ ] 31.1 Wire public gallery components together
    - Connect MediaGallery to API routes
    - Connect SearchBar and FilterPanel to gallery state
    - Connect MediaCard to MediaViewer
    - Test end-to-end browsing flow
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 31.2 Wire admin dashboard components together
    - Connect AdminMediaDashboard to API routes
    - Connect MediaUploader to upload API
    - Connect MediaEditor to update API
    - Connect ApprovalQueue to approval APIs
    - Connect AlbumManager to album APIs
    - Test end-to-end admin workflows
    - _Requirements: 4.1, 5.1, 6.2, 7.2, 7.3_

  - [ ] 31.3 Wire analytics tracking
    - Connect MediaViewer to analytics API
    - Connect download buttons to analytics API
    - Connect share buttons to analytics API
    - Connect MediaAnalytics component to analytics API
    - Test analytics data flow
    - _Requirements: 2.7, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 31.4 Wire authentication and authorization
    - Connect auth middleware to all protected routes
    - Connect role checks to UI components
    - Test access control for each role
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 31.5 Write integration tests for complete workflows
    - Test public user browsing and viewing media
    - Test member uploading media and approval workflow
    - Test admin managing media, albums, and analytics
    - Test search and filter combinations
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 4.1, 7.1, 7.4, 8.2, 8.3, 8.5_

- [ ] 32. Final checkpoint - Ensure all tests pass
  - Run all unit tests, property tests, and integration tests
  - Verify test coverage meets minimum thresholds (80% line, 75% branch, 85% function)
  - Fix any failing tests
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 33. Accessibility and final polish
  - [ ] 33.1 Add ARIA labels and roles
    - Add labels to all interactive elements
    - Add roles to custom components
    - Add live regions for dynamic content updates
    - _Requirements: 18.7_

  - [ ] 33.2 Ensure keyboard navigation
    - Test tab order for all pages
    - Add keyboard shortcuts for common actions
    - Ensure focus indicators are visible
    - _Requirements: 18.7_

  - [ ] 33.3 Verify color contrast ratios
    - Test all text against backgrounds (4.5:1 for normal, 3:1 for large)
    - Test in both light and dark modes
    - Fix any contrast issues
    - _Requirements: 18.7_

  - [ ] 33.4 Test with screen readers
    - Test with NVDA, JAWS, or VoiceOver
    - Verify all content is accessible
    - Fix any screen reader issues
    - _Requirements: 18.7_

  - [ ]* 33.5 Run automated accessibility audit
    - Use axe-core to scan all pages
    - Fix critical and serious violations
    - Document any remaining issues
    - _Requirements: 18.7_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and error conditions
- Integration tests validate complete workflows across multiple components
- All code should follow TypeScript best practices and Next.js 15 conventions
- Use shadcn/ui components for consistent UI design
- Ensure all Firebase operations use proper error handling and retry logic
- Test with Firebase emulator during development before deploying to production
