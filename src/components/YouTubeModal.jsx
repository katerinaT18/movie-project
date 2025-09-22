import React from 'react'
import Modal from './Modal'
import YouTubePlayer from './YoutubePlayer'

const YouTubeModal = ({ isOpen, onClose, videoKey, movieTitle }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={movieTitle ? `Trailer: ${movieTitle}` : 'Movie Trailer'}
    >
      {videoKey ? (
        <div className="youtube-modal-content">
          <YouTubePlayer videoKey={videoKey} />
        </div>
      ) : (
        <div className="no-trailer-message">
          <div className="no-trailer-icon">
            <i className="bi bi-film" style={{ fontSize: '3rem', color: '#666' }}></i>
          </div>
          <h3>No Trailer Available</h3>
          <p>Sorry, there's no trailer available for this movie.</p>
          <p>Please try another movie.</p>
        </div>
      )}
    </Modal>
  )
}

export default React.memo(YouTubeModal)
