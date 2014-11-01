using Microsoft.Kinect;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.IO;
using System.Threading;

using System.Net;
using System.Collections.Specialized;


namespace KinectHandTracking
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        static Stopwatch timer = null;
        static Stopwatch sendTimer = null;
        static string url = "http://172.26.5.118:3000/csharp/";
        static bool writing = false;
        static double writingDepth;
        static double currWritingX = 0;
        static double currWritingY = 0;
        static double currStopWritingX = 0;
        static double currStopWritingY = 0;

        #region Members

        KinectSensor _sensor;
        MultiSourceFrameReader _reader;
        IList<Body> _bodies;

        #endregion

        #region Constructor

        public MainWindow()
        {
            InitializeComponent();
            //socket.Connect();
        }

        #endregion

        #region Event handlers

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            //Process.Start(@"C:\Windows\System32\KinectService.exe");

            _sensor = KinectSensor.GetDefault();

            if (_sensor != null)
            {
                _sensor.Open();

                _reader = _sensor.OpenMultiSourceFrameReader(FrameSourceTypes.Color | FrameSourceTypes.Depth | FrameSourceTypes.Infrared | FrameSourceTypes.Body);
                _reader.MultiSourceFrameArrived += Reader_MultiSourceFrameArrived;
            }
        }

        private void Window_Closed(object sender, EventArgs e)
        {
            if (_reader != null)
            {
                _reader.Dispose();
            }

            if (_bodies != null)
            {
                if (_bodies.Count() > 0)
                {
                    foreach (var body in _bodies)
                    {
                       
                       // body.Dispose();
                    }
                }
            }

            if (_sensor != null)
            {
                _sensor.Close();
            }
        }

        void Reader_MultiSourceFrameArrived(object sender, MultiSourceFrameArrivedEventArgs e)
        {
            var reference = e.FrameReference.AcquireFrame();

            // Color
            using (var frame = reference.ColorFrameReference.AcquireFrame())
            {
                if (frame != null)
                {
                    camera.Source = frame.ToBitmap();
                }
            }

            // Body
            using (var frame = reference.BodyFrameReference.AcquireFrame())
            {
                if (frame != null)
                {
                    canvas.Children.Clear();

                    _bodies = new Body[frame.BodyFrameSource.BodyCount];

                    frame.GetAndRefreshBodyData(_bodies);

                    foreach (var body in _bodies)
                    {
                        if (body != null)
                        {
                            if (body.IsTracked)
                            {
                                // Find the joints
                                Joint handRight = body.Joints[JointType.HandRight];
                                Joint thumbRight = body.Joints[JointType.ThumbRight];
                                Joint tipRight = body.Joints[JointType.HandTipRight];


                               
                                //Joint handLeft = body.Joints[JointType.HandLeft];
                                //Joint thumbLeft = body.Joints[JointType.ThumbLeft];
                                //Joint tipLeft = body.Joints[JointType.HandTipLeft];

                                if (!writing)
                                {
                                    canvas.DrawHand(handRight);
                                  //  canvas.DrawHand(handLeft);
                                  //  canvas.DrawThumb(thumbRight);
                                  //  canvas.DrawThumb(thumbLeft);

                                    if (body.HandRightState == HandState.Lasso)
                                    {
                                        timer = timer == null ? Stopwatch.StartNew() : timer;
                                        currWritingX = currWritingX == 0 ? tipRight.Position.X : currWritingX;
                                        currWritingY = currWritingY == 0 ? tipRight.Position.Y : currWritingY;
                                        if (tipRight.Position.X < currWritingX - 0.2 || tipRight.Position.X > currWritingX + 0.2
                                            || tipRight.Position.Y < currWritingY - 0.2 || tipRight.Position.Y > currWritingY + 0.2)
                                        {
                                            timer = null;
                                            //timer = Stopwatch.StartNew();
                                        }
                                        else if (timer != null && timer.ElapsedMilliseconds >= 1000)
                                        {
                                            timer = null;
                                            writingDepth = tipRight.Position.Z;
                                            writing = true;
                                            currWritingX = 0;
                                            currWritingY = 0;
                                        }
                                    }

                                }

                                if (body.HandRightState == HandState.Open)
                                {
                                    timer = timer == null ? Stopwatch.StartNew() : timer;
                                    currStopWritingX = currStopWritingX == 0 ? tipRight.Position.X : currStopWritingX;
                                    currStopWritingY = currStopWritingY == 0 ? tipRight.Position.Y : currStopWritingY;
                                    if (tipRight.Position.X < currStopWritingX - 0.2 || tipRight.Position.X > currStopWritingX + 0.2
                                        || tipRight.Position.Y < currStopWritingY - 0.2 || tipRight.Position.Y > currStopWritingY + 0.2)
                                    {
                                        timer = null;
                                        //timer = Stopwatch.StartNew();
                                    }
                                    else if (timer != null && timer.ElapsedMilliseconds >= 1000)
                                    {
                                        writing = false;
                                        sendData(tipRight.Position.X.ToString(), tipRight.Position.Y.ToString(), tipRight.Position.Z.ToString());
                                        timer = null;
                                        currStopWritingX = 0;
                                        currStopWritingY = 0;
                                    }
                                }

                                canvas.DrawThumb(tipRight);
                               // canvas.DrawThumb(tipLeft);

                               // tblLeftPos.Text = "X: " + tipLeft.Position.X.ToString() + " \nY: " + tipLeft.Position.Y.ToString() + " \nZ: " + tipLeft.Position.Z.ToString();
                                tblRightPos.Text = "X: " + tipRight.Position.X.ToString() + " \nY: " + tipRight.Position.Y.ToString() + " \nZ: " + tipRight.Position.Z.ToString();

                                sendTimer = sendTimer == null ? Stopwatch.StartNew() : sendTimer;

                                if (writing && sendTimer.ElapsedMilliseconds >= 40)
                                { 
                                    sendData(tipRight.Position.X.ToString(), tipRight.Position.Y.ToString(), tipRight.Position.Z.ToString());
                                    sendTimer = null;
                                    sendTimer = Stopwatch.StartNew();
                                }
                            }
                        }
                    }
                }
            }
        }

        void sendData(string positionX, string positionY, string positionZ)
        {
            using (var wb = new WebClient())
            {
                var data = new NameValueCollection();
                data["writing"] = writing.ToString();
                data["xValue"] = positionX;
                data["yValue"] = positionY;
                data["zValue"] = positionZ;
                data["initZ"] = writingDepth.ToString(); ;

                var response = wb.UploadValues(url, "POST", data);
            }
        }

        #endregion
    }
}
