// Shared, mobile-safe metadata. Video sources are data only: callers must not
// create a media element or request mediaSource until the visitor chooses Play.
const WORKS = [
  {
    id: 'fst',
    title: 'Localizing visual motion area FST in human',
    category: 'Visual neuroscience',
    meta: 'Vision Sciences Society Annual Meeting (poster) - May 2024',
    detailImage: './posters/fst-detail.webp',
    kind: 'image'
  },
  {
    id: 'decoding',
    title: 'Single-trial fMRI decoding of 3D motion with stereoscopic and perspective cues',
    category: 'fMRI and computational neuroscience',
    meta: 'Vision Sciences Society Annual Meeting, St. Pete Beach (poster) - May 2023',
    detailImage: './posters/decoding-detail.webp',
    kind: 'image'
  },
  {
    id: 'cbh',
    title: 'Center for Brain and Health - Research Institute Day Poster',
    category: 'CBH NYUAD',
    meta: 'Designed for the Center for Brain and Health at NYU Abu Dhabi - Research Institute Day 2025',
    detailImage: './posters/cbh-detail.webp',
    kind: 'image'
  },
  {
    id: 'ms-lesion-metrics',
    title: 'Enhanced Prediction of Multiple Sclerosis Disabilities Using Tract-Specific Lesion Load and Advanced Quantitative MRI Metrics',
    category: 'Multiple sclerosis neuroimaging',
    meta: 'MENACTRIMS Congress, Jeddah (poster) - November 2024; NYU Abu Dhabi Division of Science Annual Research Conference (First Place Poster) - January 2025',
    detailImage: './posters/ms-lesion-metrics-detail.webp',
    kind: 'image'
  },
  {
    id: 'ohbm-pdi',
    title: 'MP2RAGE Ventricle Distance Profiling Improves Classification of Multiple Sclerosis Subtypes',
    category: 'Multiple sclerosis neuroimaging',
    meta: 'Organization for Human Brain Mapping Annual Meeting, Brisbane (poster) - June 2025',
    detailImage: './posters/ohbm-pdi-detail.webp',
    kind: 'image'
  },
  {
    id: 'ms-research-day',
    title: 'MS Research Day',
    category: 'Research engagement and outreach',
    meta: 'Made this banner for an event for the National Multiple Sclerosis Society and NYU Abu Dhabi - 5 November 2025',
    detailImage: './posters/ms-research-day-detail.webp',
    kind: 'image'
  },
  {
    id: 'laminate',
    title: 'NMSS one pager',
    category: 'Multiple sclerosis collaboration',
    meta: 'Made this one pager for the National Multiple Sclerosis Society - 2025',
    detailImage: './posters/laminate-detail.webp',
    kind: 'image'
  },
  {
    id: 'menactrims-cvsview',
    title: 'CVS-View: AI-powered central vein sign identification',
    category: 'Multiple sclerosis software and AI',
    meta: 'Tenth MENACTRIMS Congress, Dubai (poster) - 5-6 December 2025',
    detailImage: './posters/menactrims-cvsview-detail.webp',
    kind: 'image'
  },
  {
    id: 'cbh-film',
    title: 'Center for Brain and Health - One-Minute Overview Film',
    category: 'CBH NYUAD',
    meta: 'Produced for the Center for Brain and Health at NYU Abu Dhabi - Research Institute Day 2025',
    posterImage: './media/cbh-center-film-poster.webp',
    mediaSource: './media/cbh-center-film.mp4',
    kind: 'video'
  },
  {
    id: 'resume',
    title: 'Puti Wen — Résumé',
    category: 'Résumé',
    description: 'Experience, selected projects, publications, education, and technical skills.',
    posterImage: './resume/resume-page-1.jpg?v=20260723-resume-update3',
    href: '../resume/',
    kind: 'link'
  },
  {
    id: 'contact',
    title: 'Contact Puti Wen',
    category: 'Contact',
    description: 'Email Puti about scientific visualization, research engineering, and product work.',
    posterImage: './resume/resume-page-2.jpg?v=20260723-resume-update3',
    href: 'mailto:pw1246@nyu.edu',
    kind: 'link'
  },
  {
    id: 'paper-figures',
    title: 'Random figures from published papers',
    category: 'Paper figures',
    meta: 'A single sheet of figures from past papers',
    detailImage: './figures/paper-figures-sheet.jpg',
    kind: 'image'
  },
  {
    id: 'cvs-mask-review',
    title: 'Lesion-Centered Mask Review',
    category: 'CVSView',
    description: 'Centers the camera on each lesion and toggles its mask.',
    posterImage: './media/video-posters/cvsview-lesion-mask-native.jpg',
    mediaSource: './media/cvsview-lesion-mask-native.mp4',
    kind: 'video'
  },
  {
    id: 'cvs-rapid-navigation',
    title: 'Rapid Lesion Navigation',
    category: 'CVSView',
    description: 'Moves quickly between lesions with automatic camera centering.',
    posterImage: './media/video-posters/cvsview-rapid-navigation-native.jpg',
    mediaSource: './media/cvsview-rapid-navigation-native.mp4',
    kind: 'video'
  },
  {
    id: 'cvs-prl-review',
    title: 'CVS/PRL Review and Reporting',
    category: 'CVSView',
    description: 'Reviews co-registered FLAIR*, phase, and FLAIR images at each lesion and saves the results.',
    posterImage: './media/video-posters/cvsview-cvs-prl-review-web-720.jpg',
    mediaSource: './media/cvsview-cvs-prl-review-web-720.mp4',
    kind: 'video'
  },
  {
    id: 'lesion-segmentation',
    title: 'Lesion-Centered Segmentation',
    category: 'LesionView',
    description: 'Shows the segmentation mask with the camera centered on the lesion.',
    posterImage: './media/video-posters/lesionview-lesion-segmentation-native.jpg',
    mediaSource: './media/lesionview-lesion-segmentation-native.mp4',
    kind: 'video'
  },
  {
    id: 'lesion-comparison',
    title: 'Baseline and Follow-up Comparison',
    category: 'LesionView',
    description: 'Displays co-registered baseline and follow-up scans for any lesion.',
    posterImage: './media/video-posters/lesionview-longitudinal-comparison-native.jpg',
    mediaSource: './media/lesionview-longitudinal-comparison-native.mp4',
    kind: 'video'
  },
  {
    id: 'lesion-verification',
    title: 'New Lesion Verification',
    category: 'LesionView',
    description: 'Reviews and verifies newly detected lesions.',
    posterImage: './media/video-posters/lesionview-new-lesion-verification-native.jpg',
    mediaSource: './media/lesionview-new-lesion-verification-native.mp4',
    kind: 'video'
  },
  {
    id: 'myphysio-app-welcome',
    title: 'App Welcome',
    category: 'Clinical care app',
    description: 'Launches MyPhysio and introduces the patient experience.',
    posterImage: './media/video-posters/myphysio-01-app-welcome.jpg',
    mediaSource: './media/myphysio-01-app-welcome.mp4?v=20260720-balanced1',
    kind: 'video'
  },
  {
    id: 'myphysio-daily-exercise',
    title: "Today's Exercise Plan",
    category: 'Clinical care app',
    description: 'Shows the exercises assigned for the day.',
    posterImage: './media/video-posters/myphysio-02-daily-exercise.jpg',
    mediaSource: './media/myphysio-02-daily-exercise.mp4?v=20260720-balanced1',
    kind: 'video'
  },
  {
    id: 'myphysio-workout-tracker',
    title: 'Guided Workout Tracker',
    category: 'Clinical care app',
    description: 'Follows the patient through an exercise session.',
    posterImage: './media/video-posters/myphysio-03-workout-tracker.jpg',
    mediaSource: './media/myphysio-03-workout-tracker.mp4?v=20260720-balanced1',
    kind: 'video'
  },
  {
    id: 'myphysio-pain-diary',
    title: 'Pain & Discomfort Diary',
    category: 'Clinical care app',
    description: 'Records pain and discomfort over time.',
    posterImage: './media/video-posters/myphysio-04-pain-diary.jpg',
    mediaSource: './media/myphysio-04-pain-diary.mp4?v=20260720-balanced1',
    kind: 'video'
  },
  {
    id: 'myphysio-rom-diary',
    title: 'Range-of-Motion Diary',
    category: 'Clinical care app',
    description: 'Logs and tracks patient range of motion.',
    posterImage: './media/video-posters/myphysio-05-rom-diary.jpg',
    mediaSource: './media/myphysio-05-rom-diary.mp4?v=20260720-balanced1',
    kind: 'video'
  },
  {
    id: 'myphysio-program-manager',
    title: 'Exercise Program Manager',
    category: 'Clinical care app',
    description: 'Manages the exercise program assigned to the patient.',
    posterImage: './media/video-posters/myphysio-06-manage-program.jpg',
    mediaSource: './media/myphysio-06-manage-program.mp4?v=20260720-balanced1',
    kind: 'video'
  },
  {
    id: 'myphysio-patient-progress',
    title: 'Patient Progress at a Glance',
    category: 'Clinical care app',
    description: 'Exercise completion, pain, and range-of-motion tracking.',
    detailImage: './media/myphysio-07-stats.png',
    kind: 'image'
  },
  {
    id: 'myphysio-physio-dashboard',
    title: 'Physiotherapist Dashboard',
    category: 'Clinical care app',
    description: 'Desktop overview for monitoring patients and managing care.',
    detailImage: './media/myphysio-08-physio-dashboard.png',
    kind: 'image'
  },
  {
    id: 'phd-defense',
    title: 'PhD Defense',
    category: 'Visual neuroscience',
    description: 'A defense presentation about motion perception and how the mind reconstructs the external world.',
    posterImage: './media/video-posters/defense-screening-web.jpg',
    mediaSource: './media/defense-screening-web.mp4?v=20260717-faststart',
    kind: 'video'
  },
  {
    id: 'mri-afqview',
    title: 'AFQView',
    category: 'Scientific visualization',
    description: 'Interactive exploration of white-matter tract profiles and bundle-level measurements.',
    posterImage: './mri-room/brain-pdf-5-updated-v2.png?v=20260718-mri-pdf-black-video-frames',
    previewImage: './media/video-posters/mri-afqview-preview.webp?v=20260722-mri-preview1',
    mediaSource: './media/mri-afqview-hd.mp4',
    kind: 'video'
  },
  {
    id: 'mri-functional',
    title: 'Functional MRI',
    category: 'Scientific visualization',
    description: 'A functional MRI visualization embedded in the MRI room research wall.',
    posterImage: './mri-room/brain-pdf-7-updated-clean-v2.png?v=20260718-mri-pdf-black-video-frames',
    previewImage: './media/video-posters/mri-fmri-preview.webp?v=20260722-mri-preview1',
    mediaSource: './media/mri-fmri-hd.mp4',
    kind: 'video'
  },
  {
    id: 'game-echoing-end',
    title: 'Echoing End',
    category: 'Interactive game',
    description: 'Post-apocalyptic survival of a kid and a dog.',
    posterImage: './media/video-posters/everything-everywhere-game.png',
    mediaSource: './media/everything-everywhere-game.mp4',
    kind: 'video'
  },
  {
    id: 'game-shrimp',
    title: 'Shrimp',
    category: 'Interactive game',
    description: 'Shrimp farm simulation.',
    posterImage: './media/video-posters/shrimp-tanks-game.png',
    mediaSource: './media/shrimp-tanks-game.mp4',
    href: '../shrimp-tanks/?v=20260718-shrimp-build-6c9142f1155c06ec',
    kind: 'video'
  },
  {
    id: 'film-cataract',
    title: 'Cataract',
    category: 'Short film',
    description: 'An animated short film with sound.',
    posterImage: './media/video-posters/cataract-poster-00-20.jpg?v=20260718-video-room3-poster-frames',
    mediaSource: './media/videos/cataract-audio-50.mp4?v=20260718-video-room-audio-50',
    kind: 'video'
  },
  {
    id: 'film-lower-back-pain',
    title: 'Lower Back Pain',
    category: 'Short film',
    description: 'An animated short film with sound.',
    posterImage: './media/video-posters/lower-back-pain-poster-00-11.jpg?v=20260718-video-room3-poster-frames',
    mediaSource: './media/videos/lower-back-pain-audio-50.mp4?v=20260718-video-room-audio-50',
    kind: 'video'
  },
  {
    id: 'film-goosebumps',
    title: 'Goosebumps, Hiccups, and Yawns',
    category: 'Short film',
    description: 'An animated short film with subtitles and sound.',
    posterImage: './media/video-posters/goosebumps-hiccup-yawn-sub-poster-00-11.jpg?v=20260718-video-room3-poster-frames',
    mediaSource: './media/videos/goosebumps-hiccup-yawn-sub-audio-50.mp4?v=20260718-video-room-audio-50',
    kind: 'video'
  },
  {
    id: 'film-teeth',
    title: 'Teeth',
    category: 'Short film',
    description: 'An animated short film with sound.',
    posterImage: './media/video-posters/teeth-poster-00-47.jpg?v=20260718-video-room3-poster-frames',
    mediaSource: './media/videos/teeth-audio-50.mp4?v=20260718-video-room-audio-50',
    kind: 'video'
  },
  {
    id: 'film-spider-mites',
    title: 'How to Kill Spider Mites',
    category: 'Short film',
    description: 'An animated short film with subtitles and sound.',
    posterImage: './media/video-posters/spider-mites-sub-poster-00-24.jpg?v=20260718-video-room3-poster-frames',
    mediaSource: './media/videos/spider-mites-sub-audio-50.mp4?v=20260718-video-room-audio-50',
    kind: 'video'
  },
  {
    id: 'art-new-yorker',
    title: 'New Yorker',
    category: 'Random stuff',
    description: 'I moved to New York that day',
    detailImage: './art/assets/14f75fc15b2e.jpg',
    kind: 'image'
  },
  {
    id: 'art-colored-face',
    title: 'Face',
    category: 'Colored stuff',
    description: 'A featured work from the Colored stuff collection.',
    detailImage: './art/assets/439db69efde5.png',
    kind: 'image'
  },
  {
    id: 'art-three-cat',
    title: 'Three cat',
    category: 'Cat',
    description: 'A featured work from the Cat collection.',
    detailImage: './art/assets/1564dec85228.jpg',
    kind: 'image'
  },
  {
    id: 'art-bookroom',
    title: 'Bookroom',
    category: 'Apartment',
    description: 'A featured work from the Apartment collection.',
    detailImage: './art/assets/55be41193e2e.png',
    kind: 'image'
  },
  {
    id: 'art-air-tight',
    title: 'Air tight',
    category: 'Stuff I did when I was sick',
    description: 'A featured work from this autobiographical collection.',
    detailImage: './art/assets/eda737a6a706.jpg',
    kind: 'image'
  },
  {
    id: 'art-new-york-subway',
    title: 'New York subway',
    category: 'Stuff I did when I was sick',
    description: 'A featured work from this autobiographical collection.',
    detailImage: './art/assets/d9e18431651b.jpg',
    kind: 'image'
  },
  {
    id: 'art-black-and-white',
    title: 'Black and white stuff',
    category: 'Black and white stuff',
    description: 'A featured work from the Black and white stuff collection.',
    detailImage: './art/assets/869e94724f7e.jpg',
    kind: 'image'
  },
  {
    id: 'art-csh-shirt',
    title: 'CSH T-shirt design',
    category: 'Stuff I did for others',
    description: 'A featured design from the Stuff I did for others collection.',
    detailImage: './art/assets/fa9ecfbf1fe9.png',
    kind: 'image'
  },
  {
    id: 'house-in-rain',
    title: 'House in the Rain, 2020',
    category: 'House experience',
    description: 'A film made around the childhood-house project.',
    posterImage: './media/house-in-rain-poster.jpg',
    mediaSource: './media/house-in-rain.mp4',
    kind: 'video'
  },
  {
    id: 'house-experience',
    title: 'Childhood House Experience',
    category: 'House experience',
    description: 'Design studies and renders for the life-size house environment.',
    detailImage: './house-renders/house-all-wall.jpg',
    wallImage: './house-renders/home-all-wall.png',
    kind: 'image'
  }
];

export const WORKS_BY_ID = Object.freeze(Object.fromEntries(
  WORKS.map((work) => [work.id, Object.freeze(work)])
));
