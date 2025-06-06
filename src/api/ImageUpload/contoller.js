export const uploadImageController = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ status: false, message: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => `/assets/${req.params.type}/${file.filename}`);
    
    return res.status(200).json({
      status: true,
      message: 'Image(s) uploaded successfully',
      data: imageUrls.length == 1 ? imageUrls[0] : imageUrls
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
