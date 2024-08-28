export const ASSET_TYPES = {
  AUDIO: 'audio',
  FONT: 'font',
  GIF: 'gif',
  ICON: 'icon',
  IMAGE: 'image',
  PDF: 'pdf',
  SVG: 'svg',
  VIDEO: 'video',
};

export const ASSET_SUB_TYPES = {
  ASSET: 'ASSET',
  AUDIO: 'AUDIO',
  BACKGROUNDIMAGE: 'BACKGROUNDIMAGE',
  BACKGROUNDVIDEO: 'BACKGROUNDVIDEO',
  COLLECTION_IMAGE: 'COLLECTION_IMAGE',
  DOCUMENT: 'DOCUMENT',
  FONT: 'FONT',
  ICON: 'ICON',
  IMAGE: 'IMAGE',
  PROFILE_IMAGE: 'PROFILE_IMAGE',
  SHAREIMAGE: 'SHAREIMAGE',
  VIDEO: 'VIDEO',
};

export const S3_BUCKETS = {
  USER_CONTENT: 'user-content',
  SYS_CONTENT: 'sys-content'
};

export const MB = 1048576;

export const MIME_TYPES = {
  AUDIO: {
    MP3: 'audio/mpeg'
  },
  FILE: {
    PDF: 'application/pdf',
  },
  FONT: {
    OTF: 'font/otf',
    TTF: 'font/ttf'
  },
  IMAGE: {
    GIF: 'image/gif',
    ICON: 'image/vnd.microsoft.icon',
    JPG: 'image/jpeg',
    PNG: 'image/png',
    SVG: 'image/svg+xml',
  },
  VIDEO: {
    MP4: 'video/mp4',
    MPEG: 'video/mpeg',
    OGG: 'video/ogg',
    WEBM: 'video/webm'
  }
}

export const FILE_EXTENSIONS = {
  [ASSET_SUB_TYPES.ASSET]: ['*'],
  [ASSET_SUB_TYPES.AUDIO]: ['mp3', 'audio/mpeg'],
  [ASSET_SUB_TYPES.BACKGROUNDIMAGE]: ['jpg', 'jpeg', 'gif', 'png', 'svg', 'svgz'],
  [ASSET_SUB_TYPES.BACKGROUNDVIDEO]: ['ogg', 'mp4', 'webm'],
  [ASSET_SUB_TYPES.COLLECTION_IMAGE]: ['png', 'jpg', 'jpeg'],
  [ASSET_SUB_TYPES.DOCUMENT]: ['pdf'],
  [ASSET_SUB_TYPES.FONT]: ['ttf', 'otf', 'octet-stream'],
  [ASSET_SUB_TYPES.ICON]: ['ico', 'icon', 'png', 'jpg', 'jpeg'],
  [ASSET_SUB_TYPES.IMAGE]: ['jpg', 'jpeg', 'gif', 'png', 'svg', 'svgz'],
  [ASSET_SUB_TYPES.PROFILE_IMAGE]: ['jpg', 'jpeg', 'png'],
  [ASSET_SUB_TYPES.SHAREIMAGE]: ['png', 'jpg', 'jpeg'],
  [ASSET_SUB_TYPES.VIDEO]: ['ogg', 'mp4', 'webm', 'mov']
};

export const MIME_TYPE_BY_SUB_TYPE = {
  [ASSET_SUB_TYPES.ASSET]: ['*'],
  [ASSET_SUB_TYPES.AUDIO]: [
    MIME_TYPES.AUDIO.MP3
  ],
  [ASSET_SUB_TYPES.BACKGROUNDIMAGE]: [
    MIME_TYPES.IMAGE.GIF,
    MIME_TYPES.IMAGE.JPG,
    MIME_TYPES.IMAGE.PNG,
    MIME_TYPES.IMAGE.SVG
  ],
  [ASSET_SUB_TYPES.BACKGROUNDVIDEO]: [
    MIME_TYPES.VIDEO.OGG,
    MIME_TYPES.VIDEO.MP4,
    MIME_TYPES.VIDEO.WEBM
  ],
  [ASSET_SUB_TYPES.COLLECTION_IMAGE]: [
    MIME_TYPES.IMAGE.PNG,
    MIME_TYPES.IMAGE.JPG
  ],
  [ASSET_SUB_TYPES.DOCUMENT]: [
    MIME_TYPES.FILE.PDF
  ],
  [ASSET_SUB_TYPES.FONT]: [
    MIME_TYPES.FONT.OTF,
    MIME_TYPES.FONT.TTF
  ],
  [ASSET_SUB_TYPES.ICON]: [
    MIME_TYPES.IMAGE.ICON,
    MIME_TYPES.IMAGE.PNG,
    MIME_TYPES.IMAGE.JPG
  ],
  [ASSET_SUB_TYPES.IMAGE]: [
    MIME_TYPES.IMAGE.GIF,
    MIME_TYPES.IMAGE.JPG,
    MIME_TYPES.IMAGE.PNG,
    MIME_TYPES.IMAGE.SVG
  ],
  [ASSET_SUB_TYPES.PROFILE_IMAGE]: [
    MIME_TYPES.IMAGE.JPG,
    MIME_TYPES.IMAGE.PNG
  ],
  [ASSET_SUB_TYPES.SHAREIMAGE]: [
    MIME_TYPES.IMAGE.JPG,
    MIME_TYPES.IMAGE.PNG
  ],
  [ASSET_SUB_TYPES.VIDEO]: [
    MIME_TYPES.VIDEO.OGG,
    MIME_TYPES.VIDEO.MP4,
    MIME_TYPES.VIDEO.MPEG,
    MIME_TYPES.VIDEO.WEBM
  ]
};

export const UPLOAD_FILE_SIZES = [
  {
    name: 'original',
    width: 0 // keeps original size
  },
  {
    name: 'large',
    width: 4000
  },
  {
    name: 'medium',
    width: 1200
  },
  {
    name: 'small',
    width: 400
  },
  {
    name: 'thumbnail',
    width: 120
  }
];
