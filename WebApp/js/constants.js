const CONST_PLEASE_PICK_REFERENCE_IMAGE_FIRST = 'Please Enroll First!'
const CONST_PICK_REFERENCE_IMAGE = 'Enrollment'
const CONST_NO_LIVENESS = 'No Liveness'
const CONST_SLAM_LIVENESS = 'Slam Liveness'
const CONST_CR2D_LIVENESS = 'CR2D Liveness'
const CONST_COMING_SOON = 'Coming Soon!'
const CONST_SERVER_DOWN = 'Server Down'
const CONST_INTERNET_NOT_AVAILABLE = 'Internet Not Available!'
const CONST_IMAGE_TYPE = 'SELFIE'
const CONST_CORRELATION_ID = 'c5a0aec2-1262-41b6-82bd-e9d60da92ef2'
const CONST_API_KEY = 'apikey'
const CONST_API_KEY_VALUE = 'ce5f306a-4100-414f-803c-4f15905f688e'
const CONST_FOLDER_NAME = 'Jio/'
const CONST_LOGS_FILE_NAME = CONST_FOLDER_NAME + 'LogsFile.txt'
const CONST_SD_CARD = '/sdcard/'
const CONST_BEST_IMAGE_NAME = 'BestImage.bmp'
const CONST_BEST_IMAGE_LOCATION = CONST_FOLDER_NAME + CONST_BEST_IMAGE_NAME
const CONST_SHOW_LOGS = 'Show Logs'
const CONST_APPLICATION_LOGS = 'Application Logs'
const CONST_CLEAR_LOGS = 'Clear Logs'
const CONST_LOGS_CLEARED = 'Logs Cleared!'
const CONST_MOVE_LEFT_TEXT = 'Turn your head to left'
const CONST_MOVE_RIGHT_TEXT = 'Turn your head to right'

//SlamLiveness Contants
const HEAD_WELL_POSITIONED = 'Head well positioned'
const NO_HEAD_DETECTED = 'No head detected'
const MOVE_AWAY_FROM_THE_CAMERA = 'Move away from the camera'
const MOVE_CLOSER_TO_THE_CAMERA = 'Move closer to the camera'
const TURN_YOUR_HEAD_RIGHT = 'Turn your head right'
const TURN_YOUR_HEAD_LEFT = 'Turn your head left'
const TURN_YOUR_HEAD_UP = 'Turn your head up'
const TURN_YOUR_HEAD_DOWN = 'Turn your head down'
const YOU_ARE_MOVING_TOO_FAST = 'You are moving too fast'
const TILT_YOUR_HEAD_RIGHT = 'Tilt your head right'
const TILT_YOUR_HEAD_LEFT = 'Tilt your head left'
const THE_PLACE_IS_TOO_BRIGHT = 'The place is too bright'
const THE_PLACE_IS_TOO_DARK = 'The place is too dark'
const STAND_STILL = 'Stand still'
const OPEN_YOUR_EYES = 'Open your eyes'
const POSITION_INFO_UNKNOWN = 'Position Info Unknown'

//URLs
const BASE_URL = 'https://api.stodeveu.xantav.com/bioserver-app/v2/'
const MONITOR_API = 'monitor'
const MATCH_IMAGES_API = 'match/images'


const SLAM_LIVENESS_INFO = {
    POSITION_INFO_GOOD: 0, // Head well positionned
    POSITION_INFO_MOVE_BACK_INTO_FRAME: 1, // No head detected
    POSITION_INFO_CENTER_MOVE_BACKWARDS: 2, // Move away from the camera
    POSITION_INFO_CENTER_MOVE_FORWARDS: 3, // Move closer to the camera
    POSITION_INFO_CENTER_TURN_RIGHT: 4, // Turn your head right
    POSITION_INFO_CENTER_TURN_LEFT: 5, // Turn your head left
    POSITION_INFO_CENTER_ROTATE_UP: 6, // Turn your head up
    POSITION_INFO_CENTER_ROTATE_DOWN: 7, // Turn your head down
    POSITION_INFO_MOVING_TOO_FAST: 8, // You are moving too fast
    POSITION_INFO_CENTER_TILT_RIGHT: 9, // Tilt your head right
    POSITION_INFO_CENTER_TILT_LEFT: 10, // Tilt your head left
    POSITION_INFO_MOVE_DARKER_AREA: 11, // The place is too bright
    POSITION_INFO_MOVE_BRIGHTER_AREA: 12, // The place is too dark
    POSITION_INFO_STAND_STILL: 13, // Stand still
    POSITION_INFO_OPEN_EYES: 14, // Open your eyes
    POSITION_INFO_UNKNOWN: 0xFF
}