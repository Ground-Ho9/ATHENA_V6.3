
import * as Linking from 'expo-linking';

// Stub function to detect if app was opened via a dynamic link
export async function getInitialLink() {
  const initialUrl = await Linking.getInitialURL();
  return initialUrl;
}

// You can expand this to parse the URL and extract information later
export function parseDynamicLink(url) {
  if (!url) return null;
  // Example: https://athena.page.link/XYZ123
  const path = Linking.parse(url);
  return path;
}
