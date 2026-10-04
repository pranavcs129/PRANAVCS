export const ROUTES = {
  HOME: '/',
  PHOTOGRAPHY: '/photography',
  VIDEO_EDITING: '/video-editing',
  VIBE_CODING: '/vibe-coding',
};

export const CARD_ROUTES = {
  'photography': ROUTES.PHOTOGRAPHY,
  'video-editing': ROUTES.VIDEO_EDITING,
  'vibe-coding': ROUTES.VIBE_CODING,
};

export const ROUTE_TO_CARD = {
  [ROUTES.PHOTOGRAPHY]: 'photography',
  [ROUTES.VIDEO_EDITING]: 'video-editing',
  [ROUTES.VIBE_CODING]: 'vibe-coding',
};

export const isSkillRoute = (path) => {
  return [ROUTES.PHOTOGRAPHY, ROUTES.VIDEO_EDITING, ROUTES.VIBE_CODING].includes(path);
};
