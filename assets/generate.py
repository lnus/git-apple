import cv2
import imutils
import json

def draw_row(row):
    ascii_frame = []
    for pixel in row:
        if pixel < 128:
            ascii_frame.append(1)
        else:
            ascii_frame.append(0)
    return ascii_frame

def draw_frame(frame):
    ascii_frame = [draw_row(row) for row in frame]
    return ascii_frame

if __name__ == "__main__":
    # Store all frames in a list
    frames = []

    # Read the video file
    cap = cv2.VideoCapture('ba.mp4')

    while cap.isOpened():
        ret, frame = cap.read()

        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        small = imutils.resize(gray, width=40)
        frames.append(draw_frame(small))

    # Release the VideoCapture object
    cap.release()

    # Convert frames to JSON and write to file
    with open("frames.json", "w") as f:
        f.write(json.dumps(frames))
