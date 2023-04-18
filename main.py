import cv2
import imutils
import time

def draw_row(row):
    ascii_frame = ""
    for pixel in row:
        if pixel < 128:
            ascii_frame += "⬛"
        else:
            ascii_frame += "🟩"
    return ascii_frame

def draw_frame(frame):
    ascii_frame = ""
    for row in frame:
        ascii_frame += draw_row(row) + "\n"
    return ascii_frame

# FIXME: This doesn't scale it proeperly
def downscale(frame, ratio):
    return cv2.resize(frame, (int(frame.shape[1]/ratio), int(frame.shape[0]/ratio)))

FRAME_RATE = 30

if __name__ == "__main__":
    # Read the video file
    cap = cv2.VideoCapture('ba.mp4')

    # Store all frames in a list
    frames = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        small = imutils.resize(gray, width=60)
        frames.append(draw_frame(small))


    # Print all frames in order, and clear the screen
    for frame in frames:
        print(frame)
        time.sleep(1/FRAME_RATE)
        print("\033c", end="")

    # Release the VideoCapture object
    cap.release()

