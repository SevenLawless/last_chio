import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getUserPreferences, getOrCreateUserPreferences, updateUserPreferences } from '../models/UserPreferences';

const router = express.Router();

// Get user preferences
router.get('/preferences', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const preferences = await getOrCreateUserPreferences(userId);
    res.json({
      primary_color: preferences.primary_color,
      background_base_color: preferences.background_base_color,
      background_surface_color: preferences.background_surface_color,
      accent_color: preferences.accent_color
    });
  } catch (error) {
    console.error('Get user preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
});

// Update user preferences
router.put('/preferences', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { primary_color, background_base_color, background_surface_color, accent_color } = req.body;

    // Validate color format (hex color)
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    const colorsToValidate = [
      { name: 'primary_color', value: primary_color },
      { name: 'background_base_color', value: background_base_color },
      { name: 'background_surface_color', value: background_surface_color },
      { name: 'accent_color', value: accent_color }
    ];

    for (const { name, value } of colorsToValidate) {
      if (value !== undefined && !colorRegex.test(value)) {
        return res.status(400).json({ error: `Invalid ${name} format. Must be a hex color (e.g., #5A9AA8)` });
      }
    }

    // Ensure preferences exist
    await getOrCreateUserPreferences(userId);

    // Update preferences
    await updateUserPreferences(
      userId,
      primary_color,
      background_base_color,
      background_surface_color,
      accent_color
    );

    const updatedPreferences = await getUserPreferences(userId);
    res.json({
      primary_color: updatedPreferences!.primary_color,
      background_base_color: updatedPreferences!.background_base_color,
      background_surface_color: updatedPreferences!.background_surface_color,
      accent_color: updatedPreferences!.accent_color
    });
  } catch (error) {
    console.error('Update user preferences error:', error);
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

export default router;

